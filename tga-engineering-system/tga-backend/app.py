import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from threading import Thread
import uuid
import time
from typing import Dict, Any

# Import the services we've created
from services.revit_integration import RevitIntegrationService
from services.standards_rules import StandardsManager
from config import settings

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for the frontend

# --- Service Instances ---
revit_service = RevitIntegrationService()
standards_manager = StandardsManager()

# --- In-memory database (for demonstration purposes) ---
# In a production environment, you would use a real database (e.g., PostgreSQL, MongoDB).
# This dictionary stores the state of each project.
projects_db: Dict[str, Any] = {}

# --- Helper Functions ---
def process_project_in_background(project_id: str, file_data: bytes, project_config: Dict[str, Any]):
    """
    Simulates the long-running process of design automation in a background thread.
    This prevents the API request from timing out.
    """
    print(f"Starting background processing for project: {project_id}")
    
    # Update project status
    projects_db[project_id]['status'] = 'processing'
    projects_db[project_id]['stages'] = [
        {'name': 'Uploading file to APS', 'status': 'pending'},
        {'name': 'Submitting work item', 'status': 'pending'},
        {'name': 'Monitoring job status', 'status': 'pending'},
        {'name': 'Downloading results', 'status': 'pending'},
        {'name': 'Performing compliance check', 'status': 'pending'},
        {'name': 'Processing complete', 'status': 'pending'},
    ]

    try:
        # Step 1: Upload the file to Autodesk Platform Services (APS)
        projects_db[project_id]['stages'][0]['status'] = 'active'
        file_name = project_config['dwgFile']
        bucket_key = settings.APS_BUCKET_KEY
        # Create bucket first if it doesn't exist
        revit_service._create_bucket(bucket_key)
        object_id = revit_service.upload_file(bucket_key, file_data, file_name)
        projects_db[project_id]['stages'][0]['status'] = 'completed'
        print(f"File uploaded with objectId: {object_id}")

        # Step 2: Submit a work item to Design Automation for Revit
        projects_db[project_id]['stages'][1]['status'] = 'active'
        # Note: The input_file_url should be the object_id
        work_item_payload = revit_service.create_and_run_work_item(object_id, f'output_{file_name}', project_config)
        projects_db[project_id]['work_item_id'] = work_item_payload['id']
        projects_db[project_id]['stages'][1]['status'] = 'completed'
        print(f"Work item submitted: {work_item_payload['id']}")

        # Step 3: Monitor the work item until it's finished
        projects_db[project_id]['stages'][2]['status'] = 'active'
        final_status = revit_service.monitor_work_item(work_item_payload['id'])
        if final_status['status'] != 'success':
            raise Exception(f"Design Automation job failed with status: {final_status['status']}")
        projects_db[project_id]['stages'][2]['status'] = 'completed'
        print("Work item completed successfully.")

        # Step 4: Download the generated result file
        projects_db[project_id]['stages'][3]['status'] = 'active'
        output_file_data = revit_service.download_file(bucket_key, f'output_{file_name}')
        
        # Save the file to a local directory for the user to download
        output_path = os.path.join(settings.OUTPUT_DIR, f'output_{file_name}')
        with open(output_path, 'wb') as f:
            f.write(output_file_data)
        projects_db[project_id]['output_file_path'] = output_path
        projects_db[project_id]['stages'][3]['status'] = 'completed'
        print(f"Result file saved to {output_path}")

        # Step 5: Perform compliance check based on the final project
        projects_db[project_id]['stages'][4]['status'] = 'active'
        # For demonstration, we'll use a mock compliance check
        # In a real app, this would analyze the output_file_data
        mock_standards = ['DIN 18015', 'VDI 2052']
        violations = standards_manager.check_compliance(project_config, mock_standards)
        projects_db[project_id]['compliance_results'] = [
            {'standard': v.standard, 'description': v.description, 'recommendation': v.recommendation}
            for v in violations
        ]
        projects_db[project_id]['stages'][4]['status'] = 'completed'
        print("Compliance check completed.")

        # Step 6: Mark as complete
        projects_db[project_id]['stages'][5]['status'] = 'completed'
        projects_db[project_id]['status'] = 'completed'
        print(f"Project '{project_id}' completed successfully.")

    except Exception as e:
        print(f"An error occurred during project processing for {project_id}: {e}")
        projects_db[project_id]['status'] = 'error'
        # Mark the active stage as error and subsequent stages as cancelled
        error_stage_index = next((i for i, s in enumerate(projects_db[project_id]['stages']) if s['status'] == 'active'), -1)
        if error_stage_index != -1:
            projects_db[project_id]['stages'][error_stage_index]['status'] = 'error'
            for i in range(error_stage_index + 1, len(projects_db[project_id]['stages'])):
                projects_db[project_id]['stages'][i]['status'] = 'cancelled'

# --- API Endpoints ---

@app.route('/api/project/start', methods=['POST'])
def start_project():
    """
    Endpoint to start a new project.
    Expects a file upload and project configuration data in the request.
    """
    if 'dwgFile' not in request.files or 'projectConfig' not in request.form:
        return jsonify({'error': 'Missing file or project configuration'}), 400

    # Get the file and configuration from the request
    file = request.files['dwgFile']
    project_config_str = request.form['projectConfig']
    project_config = json.loads(project_config_str)

    # Generate a unique ID for the project
    project_id = str(uuid.uuid4())
    file_name = file.filename

    # Initialize project state
    projects_db[project_id] = {
        'id': project_id,
        'status': 'queued',
        'file_name': file_name,
        'config': project_config,
        'start_time': time.time(),
        'output_file_path': None,
        'compliance_results': None,
    }

    # Start the processing in a new thread to avoid blocking the main API
    file_data = file.read()
    Thread(target=process_project_in_background, args=(project_id, file_data, project_config)).start()

    return jsonify({'project_id': project_id, 'message': 'Project started'}), 202

@app.route('/api/project/status/<project_id>', methods=['GET'])
def get_project_status(project_id: str):
    """
    Endpoint to check the current status of a project.
    """
    project_state = projects_db.get(project_id)
    if not project_state:
        return jsonify({'error': 'Project not found'}), 404
    
    # Return a simplified view of the project state
    response_data = {
        'id': project_state['id'],
        'status': project_state['status'],
        'stages': project_state.get('stages', []),
        'file_name': project_state['file_name'],
    }
    return jsonify(response_data), 200

@app.route('/api/project/results/<project_id>', methods=['GET'])
def get_project_results(project_id: str):
    """
    Endpoint to get the final results of a project, including compliance info.
    """
    project_state = projects_db.get(project_id)
    if not project_state:
        return jsonify({'error': 'Project not found'}), 404
    
    if project_state['status'] != 'completed':
        return jsonify({'error': 'Project is still being processed'}), 400
    
    # Return a complete view of the results
    response_data = {
        'id': project_state['id'],
        'file_name': project_state['file_name'],
        'compliance_results': project_state['compliance_results'],
        'output_download_url': f'/api/project/download/{project_id}'
    }
    return jsonify(response_data), 200

@app.route('/api/project/download/<project_id>', methods=['GET'])
def download_project_file(project_id: str):
    """
    Endpoint to download the final generated file.
    """
    project_state = projects_db.get(project_id)
    if not project_state or not project_state['output_file_path']:
        return jsonify({'error': 'File not found or project not complete'}), 404
        
    return send_from_directory(settings.OUTPUT_DIR, os.path.basename(project_state['output_file_path']))

# --- Main entry point ---
if __name__ == '__main__':
    # Create the output directory if it doesn't exist
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    app.run(debug=True)
