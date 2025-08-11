import re
from typing import Dict, List, Any

# This file defines the core logic for managing and applying technical standards
# and compliance rules for the TGA Desktop Automation system.

# --- Data Structures for Standards and Rules ---

# Define a structure to hold a single technical standard.
class TechnicalStandard:
    """Represents a single technical standard with its details and rules."""
    def __init__(self, number: str, title: str, type: str, category: str, rules: List[Dict[str, Any]]):
        self.number = number
        self.title = title
        self.type = type
        self.category = category
        self.rules = rules # List of rule dictionaries

class ComplianceViolation:
    """Represents a specific violation of a standard's rule."""
    def __init__(self, standard: str, rule_id: str, description: str, recommendation: str):
        self.standard = standard
        self.rule_id = rule_id
        self.description = description
        self.recommendation = recommendation

# --- StandardsManager Class ---

class StandardsManager:
    """
    Manages the loading, categorization, and evaluation of technical standards
    against project data.
    """
    
    def __init__(self):
        # A dictionary to hold all loaded standards, keyed by their number.
        self.standards: Dict[str, TechnicalStandard] = {}
        # A mapping of keywords to categories, for automatic project classification.
        self.categories = {
            'Elétrico': ['eletrica', 'eletrical', 'corrente', 'energia'],
            'Hidráulico': ['hidraulica', 'agua', 'esgoto', 'sanitario'],
            'HVAC': ['hvac', 'climatizacao', 'aquecimento'],
            'Arquitetura Base': ['arquitetura', 'planta', 'layout', 'dwg'],
            'Estrutural': ['estrutura', 'viga', 'pilar', 'laje'],
            'Prevenção Incêndio': ['incendio', 'bombeiro', 'extintor'],
            'Automação Predial': ['automacao', 'controle', 'sistema'],
            'Iluminação': ['iluminacao', 'luminaria', 'luz']
        }
        # Example of a mock standards database
        self._load_mock_standards()

    def _load_mock_standards(self):
        """
        Loads a mock set of technical standards into the manager.
        In a real-world scenario, this would load from a database or a file.
        """
        din_18015 = TechnicalStandard(
            number='DIN 18015',
            title='Instalações elétricas em edifícios residenciais',
            type='DIN',
            category='Elétrico',
            rules=[
                {'id': 'R-18015-01', 'description': 'O número mínimo de tomadas por cômodo deve ser respeitado.', 'condition': 'project_area > 50', 'recommendation': 'Verifique as tabelas da DIN 18015 para o número correto de tomadas.'},
                {'id': 'R-18015-02', 'description': 'Disjuntores diferenciais (RCDs) são obrigatórios para circuitos de banheiro e cozinha.', 'condition': 'has_bathroom and has_kitchen', 'recommendation': 'Inclua RCDs de 30mA nos circuitos de áreas úmidas.'}
            ]
        )
        
        vdi_2052 = TechnicalStandard(
            number='VDI 2052',
            title='Sistemas de ventilação para cozinhas',
            type='VDI',
            category='HVAC',
            rules=[
                {'id': 'R-2052-01', 'description': 'A taxa de troca de ar na cozinha deve ser de pelo menos 10 trocas por hora.', 'condition': 'project_type == "restaurant" or project_type == "commercial_kitchen"', 'recommendation': 'Calcule a vazão de ar necessária com base no volume da cozinha.'}
            ]
        )
        
        self.standards[din_18015.number] = din_18015
        self.standards[vdi_2052.number] = vdi_2052

    def get_standard(self, standard_number: str) -> TechnicalStandard:
        """Retrieves a standard by its number."""
        return self.standards.get(standard_number)

    def classify_project(self, project_data: Dict[str, Any]) -> List[str]:
        """
        Classifies a project into relevant TGA disciplines based on project data.
        
        Args:
            project_data (dict): A dictionary containing project information,
                                 e.g., 'disciplines', 'description'.
        
        Returns:
            List[str]: A list of detected TGA discipline categories.
        """
        detected_categories = []
        if 'disciplines' in project_data and project_data['disciplines']:
            # Prioritize explicit discipline selection from the frontend
            detected_categories = [d['name'] for d in project_data['disciplines']]
        elif 'description' in project_data and project_data['description']:
            # Fallback to keyword-based classification from a project description
            description = project_data['description'].lower()
            for category, keywords in self.categories.items():
                if any(keyword in description for keyword in keywords):
                    if category not in detected_categories:
                        detected_categories.append(category)
        return detected_categories

    def check_compliance(self, project_data: Dict[str, Any], standards_to_check: List[str]) -> List[ComplianceViolation]:
        """
        Performs compliance checks for a given project against a list of standards.
        
        Args:
            project_data (dict): The project data to evaluate.
            standards_to_check (list): A list of standard numbers to check.
        
        Returns:
            List[ComplianceViolation]: A list of any detected violations.
        """
        violations = []
        for standard_number in standards_to_check:
            standard = self.get_standard(standard_number)
            if not standard:
                print(f"Warning: Standard '{standard_number}' not found.")
                continue

            for rule in standard.rules:
                # In a real system, you would use a rule engine to evaluate the 'condition' string
                # against the project_data. For this mock, we'll use a simple placeholder check.
                is_compliant = self._evaluate_rule(rule['condition'], project_data)
                
                if not is_compliant:
                    violations.append(
                        ComplianceViolation(
                            standard=standard.number,
                            rule_id=rule['id'],
                            description=rule['description'],
                            recommendation=rule['recommendation']
                        )
                    )
        return violations

    def _evaluate_rule(self, condition: str, project_data: Dict[str, Any]) -> bool:
        """
        (Mock) Evaluates a rule condition against project data.
        This would be a complex rule engine in a production system.
        """
        # Simple evaluation logic for the mock standards
        if 'project_area' in condition and 'project_area' in project_data:
            if eval(condition, {}, {'project_area': project_data['project_area']}):
                return False # Assume it violates for this mock example
        if 'project_type' in condition and 'project_type' in project_data:
             if eval(condition, {}, {'project_type': project_data['project_type']}):
                return False
        
        return True # Assume compliant by default
