import requests
import json
import time
import os
import io

# Assume settings.py is in a 'config' directory one level up
# This is where your Autodesk API keys are stored.
from config import settings

# --- IMPORTANT CONFIGURATION ---
# The names for your AppBundle and Activity. You will need to create these
# in the Autodesk Platform Services portal or via a one-time script.
APP_BUNDLE_NAME = 'TGA_RevitAppBundle'
ACTIVITY_NAME = 'TGA_RevitActivity'
FORGE_VERSION = 'v3'
ENGINE_VERSION = 'RevitEngine+2024' # Use the latest version available


class RevitIntegrationService:
    """
    Service class to handle all interactions with the Autodesk Design Automation for Revit API.
    This class manages authentication, file uploads, work item submission,
    status monitoring, and result retrieval for Revit models.
    """

    def __init__(self):
        """Initializes the service by authenticating and setting up headers."""
        self.access_token = self._get_access_token()
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

    def _get_access_token(self):
        """
        Authenticates with Autodesk Platform Services (APS) to get a temporary access token.
        This token is required for all subsequent API calls.
        """
        url = 'https://developer.api.autodesk.com/authentication/v1/authenticate'
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        data = {
            'client_id': settings.AUTODESK_CLIENT_ID,
            'client_secret': settings.AUTODESK_CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'data:read data:write bucket:create bucket:read code:read code:write'
        }
        try:
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            return response.json()['access_token']
        except requests.exceptions.RequestException as e:
            print(f"Error authenticating with Autodesk: {e}")
            raise

    def _create_bucket(self, bucket_key):
        """Creates a temporary bucket for file storage."""
        url = 'https://developer.api.autodesk.com/oss/v2/buckets'
        data = {
            'bucketKey': bucket_key,
            'policyKey': 'transient', # Data will be deleted after 24 hours
            'region': 'US'
        }
        try:
            response = requests.post(url, headers=self.headers, data=json.dumps(data))
            if response.status_code == 409:
                print(f"Bucket '{bucket_key}' already exists.")
            else:
                response.raise_for_status()
                print(f"Bucket '{bucket_key}' created successfully.")
        except requests.exceptions.RequestException as e:
            print(f"Error creating bucket: {e}")
            raise

    def upload_file(self, bucket_key, file_data, file_name):
        """Uploads a file to the created bucket and returns its object URN."""
        url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/objects/{file_name}'
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/octet-stream'
        }
        try:
            response = requests.put(url, headers=headers, data=file_data)
            response.raise_for_status()
            print(f"File '{file_name}' uploaded successfully.")
            return response.json()['objectId']
        except requests.exceptions.RequestException as e:
            print(f"Error uploading file: {e}")
            raise

    def create_and_run_work_item(self, input_file_url, output_file_name, project_config):
        """
        Submits a work item to the Design Automation API for Revit.
        
        Args:
            input_file_url (str): The URL/URN of the input RVT file.
            output_file_name (str): The desired name for the output file.
            project_config (dict): A dictionary containing project-specific settings.
        
        Returns:
            dict: The JSON response from the API, including the work item ID.
        """
        work_item_url = f'https://developer.api.autodesk.com/revit/{FORGE_VERSION}/workitems'

        # This is a placeholder for the payload that would contain the Revit script logic
        # (e.g., a Dynamo script or an add-in name) and project configuration.
        payload = {
            "activityId": f'{settings.AUTODESK_CLIENT_ID}.{ACTIVITY_NAME}+{FORGE_VERSION}',
            "arguments": {
                "InputFile": {
                    "url": input_file_url,
                    "verb": "get"
                },
                "InputParameters": {
                    "url": "data:application/json," + json.dumps(project_config),
                    "verb": "get"
                },
                "ResultFile": {
                    "url": f'https://developer.api.autodesk.com/oss/v2/buckets/{settings.APS_BUCKET_KEY}/objects/{output_file_name}',
                    "verb": "put",
                    "Headers": {
                        "Content-Type": "application/octet-stream"
                    }
                }
            }
        }

        try:
            response = requests.post(work_item_url, headers=self.headers, data=json.dumps(payload))
            response.raise_for_status()
            print(f"Work item '{response.json()['id']}' submitted successfully.")
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error creating work item: {e}")
            raise

    def monitor_work_item(self, work_item_id):
        """
        Polls the API to check the status of a work item.
        
        Args:
            work_item_id (str): The ID of the work item to monitor.
        
        Returns:
            dict: The final JSON result of the work item.
        """
        status_url = f'https://developer.api.autodesk.com/revit/{FORGE_VERSION}/workitems/{work_item_id}'
        while True:
            try:
                response = requests.get(status_url, headers=self.headers)
                response.raise_for_status()
                status = response.json()['status']

                if status in ['success', 'failed', 'cancelled']:
                    print(f"Work item {work_item_id} finished with status: {status}.")
                    return response.json()
                
                print(f"Work item {work_item_id} status: {status}. Waiting...")
                time.sleep(5)
            
            except requests.exceptions.RequestException as e:
                print(f"Error monitoring work item: {e}")
                raise

    def download_file(self, bucket_key, file_name):
        """
        Downloads a file from the bucket.
        
        Args:
            bucket_key (str): The name of the bucket.
            file_name (str): The name of the file to download.
        
        Returns:
            bytes: The content of the downloaded file.
        """
        url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/objects/{file_name}'
        headers = {'Authorization': f'Bearer {self.access_token}'}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            print(f"File '{file_name}' downloaded successfully.")
            return response.content
        except requests.exceptions.RequestException as e:
            print(f"Error downloading file: {e}")
            raise

    def delete_bucket(self, bucket_key):
        """Deletes a bucket and all its contents."""
        url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}'
        headers = {'Authorization': f'Bearer {self.access_token}'}
        try:
            response = requests.delete(url, headers=headers)
            response.raise_for_status()
            print(f"Bucket '{bucket_key}' and its contents deleted successfully.")
        except requests.exceptions.RequestException as e:
            print(f"Error deleting bucket: {e}")
            raise

# Helper function to create the AppBundle and Activity. This is a one-time setup.
def setup_revit_automation(client_id, access_token):
    """
    Creates or updates the AppBundle and Activity required for the automation.
    This function only needs to be run once per project.
    """
    app_bundle_url = f'https://developer.api.autodesk.com/revit/{FORGE_VERSION}/appbundles'
    activity_url = f'https://developer.api.autodesk.com/revit/{FORGE_VERSION}/activities'
    headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}

    # Create AppBundle
    app_bundle_id = f'{client_id}.{APP_BUNDLE_NAME}+{FORGE_VERSION}'
    app_bundle_payload = {
        "id": APP_BUNDLE_NAME,
        "engine": ENGINE_VERSION
    }
    
    try:
        requests.post(app_bundle_url, headers=headers, data=json.dumps(app_bundle_payload)).raise_for_status()
        print(f"AppBundle '{APP_BUNDLE_NAME}' created.")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 409: # Already exists
            print(f"AppBundle '{APP_BUNDLE_NAME}' already exists.")
        else:
            print(f"Error creating AppBundle: {e}")
            return

    # Create Activity
    activity_id = f'{client_id}.{ACTIVITY_NAME}+{FORGE_VERSION}'
    activity_payload = {
        "id": ACTIVITY_NAME,
        "commandLine": [f'$(engine.path)\\\\revitcoreconsole.exe /i $(InputFile.path) /s $(DrawingScript.path) /o $(ResultFile.path)'],
        "parameters": {
            "InputFile": { "zip": False, "ondemand": False, "verb": "get", "description": "Input RVT file." },
            "DrawingScript": { "zip": False, "ondemand": False, "verb": "get", "description": "AutoCAD script for drawing." },
            "InputParameters": { "zip": False, "ondemand": False, "verb": "get", "description": "Project configuration data." },
            "ResultFile": { "zip": False, "ondemand": False, "verb": "put", "description": "The resulting RVT file." }
        },
        "engine": ENGINE_VERSION,
        "appbundles": [app_bundle_id]
    }

    try:
        requests.post(activity_url, headers=headers, data=json.dumps(activity_payload)).raise_for_status()
        print(f"Activity '{ACTIVITY_NAME}' created.")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 409: # Already exists
            print(f"Activity '{ACTIVITY_NAME}' already exists.")
        else:
            print(f"Error creating Activity: {e}")
            return

    print("Autodesk Revit Automation setup complete.")

# You would run this setup function once, perhaps from a separate management script.
# if __name__ == '__main__':
#     try:
#         service = RevitIntegrationService()
#         setup_revit_automation(settings.AUTODESK_CLIENT_ID, service.access_token)
#     except Exception as e:
#         print(f"Setup failed: {e}")
