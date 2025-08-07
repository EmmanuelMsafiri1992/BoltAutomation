import asyncio
import random
import time
from typing import List, Dict, Any

# Mock data and utility functions for the backend
def get_mock_compliance_results(project_type: str, disciplines: List[str]) -> List[Dict[str, Any]]:
    """
    Generates mock compliance results based on project type and disciplines.
    """
    compliance_results = []
    base_standards = [
        'DIN 18015 - Electrical installations in residential buildings',
        'DIN EN 12831 - Heating systems design',
        'VDI 2052 - Ventilation in kitchens',
        'VOB/C - Technical specifications',
        'DIN 1988 - Water supply systems'
    ]

    for standard in base_standards:
        compliant = random.random() > 0.2  # 80% compliance rate
        violations = []
        recommendations = []

        if not compliant:
            violations.append('Insufficient cable sizing in main distribution')
            violations.append('Missing grounding specifications')
            recommendations.append('Consider upgrading to the latest standard revision')
            recommendations.append('Add additional safety measures for commercial use')

        compliance_results.append({
            'standard': standard,
            'compliant': compliant,
            'score': random.randint(50, 100),
            'violations': violations,
            'recommendations': recommendations
        })

    return compliance_results


def get_mock_generated_files(disciplines: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates mock file outputs based on selected disciplines.
    """
    generated_files = []
    for discipline in disciplines:
        # DWG file
        generated_files.append({
            'id': f"{discipline['code']}-dwg",
            'name': f"{discipline['code']}_{discipline['name'].replace(' ', '_')}.dwg",
            'type': 'DWG',
            'discipline': discipline['name'],
            'size': random.randint(500_000, 5_000_000),
            'download_url': '#'
        })

        # PDF file
        generated_files.append({
            'id': f"{discipline['code']}-pdf",
            'name': f"{discipline['code']}_{discipline['name'].replace(' ', '_')}_Plantas.pdf",
            'type': 'PDF',
            'discipline': discipline['name'],
            'size': random.randint(200_000, 2_000_000),
            'download_url': '#'
        })

        # Excel calculations for specific disciplines
        if discipline['code'] in ['EL', 'HY', 'HV']:
            generated_files.append({
                'id': f"{discipline['code']}-xls",
                'name': f"{discipline['code']}_{discipline['name'].replace(' ', '_')}_Calculos.xlsx",
                'type': 'XLSX',
                'discipline': discipline['name'],
                'size': random.randint(50_000, 500_000),
                'download_url': '#'
            })

    return generated_files


async def run_processing_workflow(project_data: Dict[str, Any], status_callback: Any) -> Dict[str, Any]:
    """
    Simulates a multi-stage processing workflow for a project.
    """
    stages = [
        'Análise da Planta Arquitetônica...',
        'Extração de Entidades e Dimensões...',
        'Carregamento de Normas Técnicas relevantes...',
        'Geração do Projeto Elétrico...',
        'Geração do Projeto Hidráulico...',
        'Geração do Projeto HVAC...',
        'Validação de Compliance...',
        'Geração da Documentação...',
    ]

    for i, stage_name in enumerate(stages):
        await status_callback('processing', stage_name, i / len(stages))
        await asyncio.sleep(random.uniform(1.0, 3.0))

    await status_callback('completed', 'Processamento Concluído!', 1.0)
    
    # Generate mock results
    mock_disciplines = [
        {'code': 'EL', 'name': 'Elétrico'},
        {'code': 'HY', 'name': 'Hidráulico'},
        {'code': 'HV', 'name': 'HVAC'}
    ]
    
    generated_files = get_mock_generated_files(mock_disciplines)
    compliance_results = get_mock_compliance_results(project_data['projectType'], mock_disciplines)

    return {
        'files': generated_files,
        'compliance': compliance_results
    }
