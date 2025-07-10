import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, FileText, Calendar, User, Search, Download, Plus } from 'lucide-react';

interface SavedForm {
  id: string;
  patient_name: string;
  status: string;
  date_created: string;
  form_data: any;
}

export const FileManagement: React.FC = () => {
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<SavedForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormsForExport, setSelectedFormsForExport] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [savedForms, searchTerm]);

  const loadSavedForms = () => {
    const forms = JSON.parse(localStorage.getItem('hivForms') || '[]');
    setSavedForms(forms);
  };

  const filterForms = () => {
    if (!searchTerm.trim()) {
      setFilteredForms(savedForms);
      return;
    }

    const filtered = savedForms.filter(form => 
      form.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForms(filtered);
  };

  const handleEdit = (form: SavedForm) => {
    sessionStorage.setItem('editFormId', form.id);
    navigate('/');
  };

  const handleDelete = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const forms = savedForms.filter(form => form.id !== formId);
      localStorage.setItem('hivForms', JSON.stringify(forms));
      setSavedForms(forms);
    }
  };

  const handleNewForm = () => {
    sessionStorage.removeItem('editFormId');
    navigate('/');
  };

  const handleExportSelection = (formId: string, checked: boolean) => {
    if (checked) {
      setSelectedFormsForExport([...selectedFormsForExport, formId]);
    } else {
      setSelectedFormsForExport(selectedFormsForExport.filter(id => id !== formId));
    }
  };

  const handleSelectAllForExport = (checked: boolean) => {
    if (checked) {
      setSelectedFormsForExport(filteredForms.map(form => form.id));
    } else {
      setSelectedFormsForExport([]);
    }
  };

  const generateFormHTML = (form: SavedForm) => {
    const f = form.form_data || {};
    const format = (val: any) => {
      if (Array.isArray(val)) {
        return val.length > 0 ? val.join(', ') : 'Not specified';
      }
      return val || 'Not specified';
    };

    const generateLabTable = () => {
      let labTests = [];
      
      if (f.lab_investigations && Array.isArray(f.lab_investigations)) {
        labTests = f.lab_investigations;
      } else {
        const maxLength = Math.max(
          (f.lab_date || []).length,
          (f.cd4 || []).length,
          (f.viral_load || []).length,
          (f.hemoglobin || []).length,
          (f.tlc || []).length,
          (f.alc || []).length,
          (f.platelets || []).length,
          (f.esr || []).length,
          (f.blood_glucose_f || []).length,
          (f.blood_glucose_pp || []).length,
          (f.blood_glucose_r || []).length,
          (f.urea || []).length,
          (f.creatinine || []).length,
          (f.sodium || []).length,
          (f.potassium || []).length,
          (f.calcium || []).length,
          (f.phosphate || []).length,
          (f.bilirubin || []).length,
          (f.ast || []).length,
          (f.alt || []).length,
          (f.alp || []).length,
          (f.albumin || []).length,
          (f.globulin || []).length,
          (f.hbsag || []).length,
          (f.anti_hcv || []).length
        );

        for (let i = 0; i < maxLength; i++) {
          labTests.push({
            date: (f.lab_date || [])[i] || '',
            cd4: (f.cd4 || [])[i] || '',
            viral_load: (f.viral_load || [])[i] || '',
            hemoglobin: (f.hemoglobin || [])[i] || '',
            tlc: (f.tlc || [])[i] || '',
            alc: (f.alc || [])[i] || '',
            platelets: (f.platelets || [])[i] || '',
            esr: (f.esr || [])[i] || '',
            blood_glucose_f: (f.blood_glucose_f || [])[i] || '',
            blood_glucose_pp: (f.blood_glucose_pp || [])[i] || '',
            blood_glucose_r: (f.blood_glucose_r || [])[i] || '',
            urea: (f.urea || [])[i] || '',
            creatinine: (f.creatinine || [])[i] || '',
            sodium: (f.sodium || [])[i] || '',
            potassium: (f.potassium || [])[i] || '',
            calcium: (f.calcium || [])[i] || '',
            phosphate: (f.phosphate || [])[i] || '',
            bilirubin: (f.bilirubin || [])[i] || '',
            ast: (f.ast || [])[i] || '',
            alt: (f.alt || [])[i] || '',
            alp: (f.alp || [])[i] || '',
            albumin: (f.albumin || [])[i] || '',
            globulin: (f.globulin || [])[i] || '',
            hbsag: (f.hbsag || [])[i],
            anti_hcv: (f.anti_hcv || [])[i]
          });
        }
      }

      if (labTests.length === 0) {
        return '<div style="text-align: center; color: #888; font-style: italic; padding: 20px;">No laboratory investigation data available.</div>';
      }

      let tableHTML = `
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9px;">
          <thead>
            <tr style="background-color: #007bff; color: white;">
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Date</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">CD4</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Viral Load</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Hemoglobin</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">TLC</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">ALC</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Platelets</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">ESR</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Glucose (F)</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Glucose (PP)</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Glucose (R)</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Urea</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Creatinine</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Sodium</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Potassium</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Calcium</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Phosphate</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Bilirubin</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">AST</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">ALT</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">ALP</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Albumin</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Globulin</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">HBsAg</th>
              <th style="border: 1px solid #ddd; padding: 6px; text-align: center;">Anti-HCV</th>
            </tr>
          </thead>
          <tbody>
      `;

      labTests.forEach((test, i) => {
        const bgColor = i % 2 === 0 ? '#f9f9f9' : '#ffffff';
        tableHTML += `
          <tr style="background-color: ${bgColor};">
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.date || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.cd4 || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.viral_load || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.hemoglobin || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.tlc || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.alc || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.platelets || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.esr || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.blood_glucose_f || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.blood_glucose_pp || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.blood_glucose_r || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.urea || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.creatinine || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.sodium || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.potassium || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.calcium || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.phosphate || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.bilirubin || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.ast || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.alt || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.alp || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.albumin || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.globulin || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.hbsag === true ? 'Positive' : test.hbsag === false ? 'Negative' : '-'}</td>
            <td style="border: 1px solid #ddd; padding: 4px; text-align: center;">${test.anti_hcv === true ? 'Positive' : test.anti_hcv === false ? 'Negative' : '-'}</td>
          </tr>
        `;
      });

      tableHTML += '</tbody></table>';
      return tableHTML;
    };

    return `
      <div class="form-container" style="page-break-after: always; margin-bottom: 30px; border: 1px solid #ccc; padding: 20px;">
        <div class="form-header" style="background-color: #f5f5f5; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
          <h2>HIV Patient Assessment Form</h2>
          <div><strong>Form ID:</strong> ${form.id}</div>
          <div><strong>Patient Name:</strong> ${form.patient_name}</div>
          <div><strong>Date Created:</strong> ${form.date_created}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Patient Demographics</h4>
          <div><strong>Age:</strong> ${format(f.age)}</div>
          <div><strong>Sex:</strong> ${format(f.sex)}</div>
          <div><strong>ID Number:</strong> ${format(f.id_no)}</div>
          <div><strong>Address:</strong> ${format(f.address)}</div>
          <div><strong>Telephone:</strong> ${format(f.telephone)}</div>
          <div><strong>Enrollment Date:</strong> ${format(f.enroll_date)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Socio-Economic & Marital Information</h4>
          <div><strong>Education:</strong> ${format(f.education)}</div>
          <div><strong>Occupation:</strong> ${format(f.occupation)}</div>
          <div><strong>Marital Status:</strong> ${format(f.marital_status)}</div>
          <div><strong>Living with Family:</strong> ${format(f.living_with_family)}</div>
          <div><strong>Contraceptives:</strong> ${format(f.contraceptives)}</div>
          <div><strong>Heard of AIDS:</strong> ${format(f.heard_of_aids)}</div>
          <div><strong>Habits:</strong> ${format(f.habits)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Clinical History</h4>
          <div><strong>Symptoms:</strong> ${format(f.symptoms)}</div>
          <div><strong>TB Past History:</strong> ${format(f.tb_past_history)}</div>
          <div><strong>TB Present History:</strong> ${format(f.tb_present_history)}</div>
          <div><strong>ATT Initiation Date:</strong> ${format(f.att_initiation_date)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Physical Examination</h4>
          <div><strong>Physical Symptoms:</strong> ${format(f.physical_symptoms)}</div>
          <div><strong>Weight:</strong> ${format(f.weight)} kg</div>
          <div><strong>BMI:</strong> ${format(f.bmi)}</div>
          <div><strong>Weight Loss:</strong> ${format(f.weight_loss)} kg</div>
          <div><strong>Symptoms Duration:</strong> ${format(f.symptoms_duration)} weeks</div>
          <div><strong>Mantoux Test:</strong> ${format(f.mantoux_test)} mm</div>
          <div><strong>Bacillary Load:</strong> ${format(f.bacillary_load)}</div>
          <div><strong>BCG Vaccine:</strong> ${format(f.bcg_vaccine)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">TB Classification</h4>
          <div><strong>PTB Symptoms:</strong> ${format(f.ptb_symptoms)}</div>
          <div><strong>TB Type:</strong> ${format(f.tb_type)}</div>
          <div><strong>Pleural Effusion:</strong> ${format(f.pleural_effusion)}</div>
          <div><strong>Smear/Culture Results:</strong> ${format(f.smear_culture_results)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Risk Factors & Exposure History</h4>
          <div><strong>Exposure:</strong> ${format(f.exposure)}</div>
          <div><strong>Sex Risk Group:</strong> ${format(f.sex_risk_group)}</div>
          <div><strong>HIV Cause:</strong> ${format(f.hiv_cause)}</div>
          <div><strong>Transmission Category:</strong> ${format(f.transmission_category)}</div>
          <div><strong>Last Transfusion Date:</strong> ${format(f.last_transfusion_date)}</div>
          <div><strong>Transfusion Place:</strong> ${format(f.last_transfusion_place)}</div>
          <div><strong>Occupational Exposure:</strong> ${format(f.occupational_exposure)}</div>
          <div><strong>Sexual Partners:</strong> ${format(f.sexual_partners)}</div>
          <div><strong>Tattooed:</strong> ${format(f.tattooed)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">HIV-Related Illnesses</h4>
          <div><strong>Illnesses:</strong> ${format(f.illnesses)}</div>
          <div><strong>Other Illnesses:</strong> ${format(f.other_illnesses)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Treatment Information</h4>
          <div><strong>ART Type:</strong> ${format(f.art_type)}</div>
          <div><strong>ART Initiation Date:</strong> ${format(f.art_initiation_date)}</div>
          <div><strong>ATT Treatment Details:</strong> ${format(f.att_treatment_details)}</div>
          <div><strong>ATT Treatment Date:</strong> ${format(f.att_treatment_date)}</div>
          <div><strong>Other Treatments:</strong> ${format(f.other_treatments)}</div>
          <div><strong>Treatment Description:</strong> ${format(f.other_treatment_desc)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Radiology Findings</h4>
          <div><strong>Radiograph Result:</strong> ${format(f.radiograph_result)}</div>
          <div><strong>Unilateral/Bilateral:</strong> ${format(f.unilateral_bilateral)}</div>
          <div><strong>Severity:</strong> ${format(f.severity)}</div>
          <div><strong>Cavity Type:</strong> ${format(f.cavity_type)}</div>
          <div><strong>Cavity Number:</strong> ${format(f.cavity_number)}</div>
        </div>

        <div class="form-section" style="margin-bottom: 20px; border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
          <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px; margin-bottom: 15px;">Laboratory Investigations</h4>
          ${generateLabTable()}
        </div>
      </div>
    `;
  };

  const exportToPDF = () => {
    if (selectedFormsForExport.length === 0) {
      alert('Please select at least one form to export.');
      return;
    }

    const formsToExport = savedForms.filter(form => selectedFormsForExport.includes(form.id));
    
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>HIV Forms Export</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 12px;
          }
          .form-container { 
            page-break-after: always; 
            margin-bottom: 30px; 
            border: 1px solid #ccc; 
            padding: 20px; 
          }
          .form-header { 
            background-color: #f5f5f5; 
            padding: 10px; 
            margin-bottom: 20px; 
            border-radius: 5px;
          }
          .form-section { 
            margin-bottom: 20px; 
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 5px;
          }
          .form-section h4 { 
            color: #333; 
            border-bottom: 2px solid #007bff; 
            padding-bottom: 8px; 
            margin-bottom: 15px;
          }
          @media print { 
            .form-container { 
              page-break-after: always; 
            }
            body {
              font-size: 11px;
            }
          }
        </style>
      </head>
      <body>
        ${formsToExport.map(form => generateFormHTML(form)).join('')}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      setShowExportModal(false);
      setSelectedFormsForExport([]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">HIV Forms Management</h1>
            <p className="mt-2 text-gray-600">Manage and export patient assessment forms</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => setShowExportModal(true)}
              disabled={savedForms.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button
              onClick={handleNewForm}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name or form ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Forms Table */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {savedForms.length === 0 ? 'No Forms Found' : 'No Matching Forms'}
            </h2>
            <p className="text-gray-500 mb-6">
              {savedForms.length === 0 
                ? "You haven't created any HIV forms yet." 
                : "Try adjusting your search criteria."
              }
            </p>
            {savedForms.length === 0 && (
              <button
                onClick={handleNewForm}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700"
              >
                Create First Form
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredForms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{form.patient_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          form.status === 'Draft' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : form.status === 'Updated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {form.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          {form.date_created}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(form)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors duration-200"
                            title="Edit Form"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(form.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-200"
                            title="Delete Form"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{savedForms.length}</div>
              <div className="text-sm text-gray-600">Total Forms</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {savedForms.filter(f => f.status === 'Draft').length}
              </div>
              <div className="text-sm text-gray-600">Draft Forms</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {savedForms.filter(f => f.status === 'Updated').length}
              </div>
              <div className="text-sm text-gray-600">Updated Forms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Forms as PDF</h3>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFormsForExport.length === filteredForms.length && filteredForms.length > 0}
                    onChange={(e) => handleSelectAllForExport(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Select All</span>
                </label>
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-2 mb-4">
                {filteredForms.map((form) => (
                  <label key={form.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedFormsForExport.includes(form.id)}
                      onChange={(e) => handleExportSelection(form.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {form.id} - {form.patient_name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    setSelectedFormsForExport([]);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={selectedFormsForExport.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
