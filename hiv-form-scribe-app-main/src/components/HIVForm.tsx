import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccordionSection } from './AccordionSection';
import { FormField, RadioGroup, CheckboxGroup } from './FormField';
import { LabInvestigations } from './LabInvestigations';

interface FormData {
  // Patient Demographics
  name: string;
  age: string;
  sex: string;
  id_no: string;
  address: string;
  telephone: string;
  enroll_date: string;
  
  // Socio-Economic & Marital Info
  education: string;
  occupation: string;
  marital_status: string;
  habits: string[];
  living_with_family: string;
  contraceptives: string;
  heard_of_aids: string;
  
  // Clinical History
  symptoms: string[];
  tb_past_history: string;
  tb_present_history: string;
  att_initiation_date: string;
  
  // Symptoms Overview
  physical_symptoms: string[];
  weight: string;
  bmi: string;
  weight_loss: string;
  symptoms_duration: string;
  mantoux_test: string;
  bacillary_load: string;
  bcg_vaccine: string;
  
  // TB Classification
  ptb_symptoms: string[];
  tb_type: string[];
  pleural_effusion: string;
  smear_culture_results: string;
  
  // Risk and Exposure History
  exposure: string[];
  sex_risk_group: string;
  hiv_cause: string[];
  transmission_category: string;
  last_transfusion_date: string;
  last_transfusion_place: string;
  occupational_exposure: string;
  sexual_partners: string;
  tattooed: string;
  
  // HIV-Related Illnesses
  illnesses: string[];
  other_illnesses: string;
  
  // Treatment Details
  art_type: string;
  art_initiation_date: string;
  att_treatment_details: string;
  att_treatment_date: string;
  other_treatments: string;
  other_treatment_desc: string;
  
  // Radiology Findings
  radiograph_result: string;
  unilateral_bilateral: string;
  severity: string;
  cavity_type: string;
  cavity_number: string;
  
  // Lab Investigations
  lab_tests: any[];
}

const defaultFormData: FormData = {
  name: '',
  age: '',
  sex: '',
  id_no: '',
  address: '',
  telephone: '',
  enroll_date: '',
  education: '',
  occupation: '',
  marital_status: '',
  habits: [],
  living_with_family: '',
  contraceptives: '',
  heard_of_aids: '',
  symptoms: [],
  tb_past_history: '',
  tb_present_history: '',
  att_initiation_date: '',
  physical_symptoms: [],
  weight: '',
  bmi: '',
  weight_loss: '',
  symptoms_duration: '',
  mantoux_test: '',
  bacillary_load: '',
  bcg_vaccine: '',
  ptb_symptoms: [],
  tb_type: [],
  pleural_effusion: '',
  smear_culture_results: '',
  exposure: [],
  sex_risk_group: '',
  hiv_cause: [],
  transmission_category: '',
  last_transfusion_date: '',
  last_transfusion_place: '',
  occupational_exposure: '',
  sexual_partners: '',
  tattooed: '',
  illnesses: [],
  other_illnesses: '',
  art_type: '',
  art_initiation_date: '',
  att_treatment_details: '',
  att_treatment_date: '',
  other_treatments: '',
  other_treatment_desc: '',
  radiograph_result: '',
  unilateral_bilateral: '',
  severity: '',
  cavity_type: '',
  cavity_number: '',
  lab_tests: [{}],
};

export const HIVForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submissionTime, setSubmissionTime] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const editFormId = sessionStorage.getItem('editFormId');
    if (editFormId) {
      const forms = JSON.parse(localStorage.getItem('hivForms') || '[]');
      const formToEdit = forms.find((f: any) => f.id === editFormId);
      if (formToEdit) {
        setFormData({ ...defaultFormData, ...formToEdit.form_data });
      }
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const editFormId = sessionStorage.getItem('editFormId');
    const existingForms = JSON.parse(localStorage.getItem('hivForms') || '[]');
    
    const formEntry = {
      id: editFormId || 'F' + String(Date.now()).slice(-6),
      patient_name: formData.name || 'Unnamed',
      status: editFormId ? 'Updated' : 'Draft',
      date_created: new Date().toISOString().split('T')[0],
      form_data: formData
    };

    if (editFormId) {
      const index = existingForms.findIndex((f: any) => f.id === editFormId);
      if (index !== -1) {
        existingForms[index] = formEntry;
      }
      sessionStorage.removeItem('editFormId');
    } else {
      existingForms.push(formEntry);
    }

    localStorage.setItem('hivForms', JSON.stringify(existingForms));
    setSubmissionTime(new Date().toLocaleString());

    // Show success message and navigate to files page
    setTimeout(() => {
      navigate('/files');
    }, 1000);
  };

  const editFormId = sessionStorage.getItem('editFormId');
  const isEditing = !!editFormId;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            {isEditing ? 'Edit HIV Form' : 'Patient Details'}
          </h1>
          {isEditing && (
            <p className="text-center text-gray-600 mt-2">
              Editing Form ID: {editFormId}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AccordionSection title="Patient Demographics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Name">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
              
              <FormField label="Age">
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  min="0"
                  max="120"
                  required
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <FormField label="Sex">
              <RadioGroup
                name="sex"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
                value={formData.sex}
                onChange={(value) => updateFormData('sex', value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="ID No.">
                <input
                  type="text"
                  value={formData.id_no}
                  onChange={(e) => updateFormData('id_no', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
              
              <FormField label="Telephone No.">
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={(e) => updateFormData('telephone', e.target.value)}
                  pattern="^\d{10}$"
                  placeholder="10 digits"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <FormField label="Address">
              <textarea
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded text-base resize-y"
              />
            </FormField>

            <FormField label="Date of Enrollment">
              <input
                type="date"
                value={formData.enroll_date}
                onChange={(e) => updateFormData('enroll_date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-base"
              />
            </FormField>
          </AccordionSection>

          <AccordionSection title="Socio-Economic & Marital Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Education">
                <select
                  value={formData.education}
                  onChange={(e) => updateFormData('education', e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded text-base"
                >
                  <option value="">Select</option>
                  <option value="None">None</option>
                  <option value="School">School</option>
                  <option value="Higher">Higher</option>
                </select>
              </FormField>
              
              <FormField label="Occupation">
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <FormField label="Marital Status">
              <RadioGroup
                name="marital_status"
                options={[
                  { value: 'Never Married', label: 'Never Married' },
                  { value: 'Married', label: 'Married' },
                  { value: 'Widowed', label: 'Widowed' },
                  { value: 'Divorced', label: 'Divorced' }
                ]}
                value={formData.marital_status}
                onChange={(value) => updateFormData('marital_status', value)}
                required
              />
            </FormField>

            <FormField label="Socio-Economic Status + Habits">
              <CheckboxGroup
                name="habits"
                options={[
                  { value: 'Alcohol', label: 'Alcohol' },
                  { value: 'Drug Addiction', label: 'Drug Addiction' },
                  { value: 'Smoking', label: 'Smoking' }
                ]}
                values={formData.habits}
                onChange={(values) => updateFormData('habits', values)}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Living with Family">
                <RadioGroup
                  name="living_with_family"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.living_with_family}
                  onChange={(value) => updateFormData('living_with_family', value)}
                  required
                />
              </FormField>

              <FormField label="Using Contraceptives">
                <RadioGroup
                  name="contraceptives"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.contraceptives}
                  onChange={(value) => updateFormData('contraceptives', value)}
                  required
                />
              </FormField>

              <FormField label="Ever Heard of AIDS">
                <RadioGroup
                  name="heard_of_aids"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.heard_of_aids}
                  onChange={(value) => updateFormData('heard_of_aids', value)}
                  required
                />
              </FormField>
            </div>
          </AccordionSection>

          <AccordionSection title="Clinical History">
            <FormField label="Symptoms (check all that apply)">
              <CheckboxGroup
                name="symptoms"
                options={[
                  { value: 'Fever', label: 'Fever' },
                  { value: 'Weight Loss', label: 'Weight Loss' },
                  { value: 'Diarrhea', label: 'Diarrhea' },
                  { value: 'Oral Ulcers', label: 'Oral Ulcers' }
                ]}
                values={formData.symptoms}
                onChange={(values) => updateFormData('symptoms', values)}
              />
            </FormField>

            <fieldset className="border border-gray-300 p-4 mt-4 rounded">
              <legend className="font-bold px-2">Tuberculosis History</legend>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Past History">
                  <RadioGroup
                    name="tb_past_history"
                    options={[
                      { value: 'Yes', label: 'Yes' },
                      { value: 'No', label: 'No' }
                    ]}
                    value={formData.tb_past_history}
                    onChange={(value) => updateFormData('tb_past_history', value)}
                  />
                </FormField>

                <FormField label="Present History">
                  <RadioGroup
                    name="tb_present_history"
                    options={[
                      { value: 'Yes', label: 'Yes' },
                      { value: 'No', label: 'No' }
                    ]}
                    value={formData.tb_present_history}
                    onChange={(value) => updateFormData('tb_present_history', value)}
                  />
                </FormField>
              </div>

              <FormField label="Date of ATT Initiation">
                <input
                  type="date"
                  value={formData.att_initiation_date}
                  onChange={(e) => updateFormData('att_initiation_date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </fieldset>
          </AccordionSection>

          <AccordionSection title="Symptoms Overview">
            <FormField label="Physical Symptoms">
              <CheckboxGroup
                name="physical_symptoms"
                options={[
                  { value: 'Cough', label: 'Cough' },
                  { value: 'Expectoration', label: 'Expectoration' },
                  { value: 'Dyspnea', label: 'Dyspnea' }
                ]}
                values={formData.physical_symptoms}
                onChange={(values) => updateFormData('physical_symptoms', values)}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Weight (kg)">
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>

              <FormField label="BMI">
                <input
                  type="number"
                  value={formData.bmi}
                  onChange={(e) => updateFormData('bmi', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>

              <FormField label="Weight Loss (kg)">
                <input
                  type="number"
                  value={formData.weight_loss}
                  onChange={(e) => updateFormData('weight_loss', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Duration of symptoms (weeks)">
                <input
                  type="number"
                  value={formData.symptoms_duration}
                  onChange={(e) => updateFormData('symptoms_duration', e.target.value)}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>

              <FormField label="Mantoux Test Result (mm)" tooltip="Measure of immune response to TB antigen">
                <input
                  type="number"
                  value={formData.mantoux_test}
                  onChange={(e) => updateFormData('mantoux_test', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Bacillary Load">
                <select
                  value={formData.bacillary_load}
                  onChange={(e) => updateFormData('bacillary_load', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                >
                  <option value="">Select</option>
                  <option value="3+">3+</option>
                  <option value="2+">2+</option>
                  <option value="1+">1+</option>
                  <option value="scanty">Scanty</option>
                  <option value="negative">Negative</option>
                </select>
              </FormField>

              <FormField label="BCG Vaccine">
                <RadioGroup
                  name="bcg_vaccine"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.bcg_vaccine}
                  onChange={(value) => updateFormData('bcg_vaccine', value)}
                />
              </FormField>
            </div>
          </AccordionSection>

          <AccordionSection title="TB Classification">
            <FormField label="PTB Symptoms">
              <CheckboxGroup
                name="ptb_symptoms"
                options={[
                  { value: 'Cough', label: 'Cough' },
                  { value: 'Hemoptysis', label: 'Hemoptysis' },
                  { value: 'Chest Pain', label: 'Chest Pain' }
                ]}
                values={formData.ptb_symptoms}
                onChange={(values) => updateFormData('ptb_symptoms', values)}
              />
            </FormField>

            <FormField label="TB Type">
              <CheckboxGroup
                name="tb_type"
                options={[
                  { value: 'EPTB', label: 'EPTB' },
                  { value: 'DTB', label: 'DTB' },
                  { value: 'MTB', label: 'MTB' }
                ]}
                values={formData.tb_type}
                onChange={(values) => updateFormData('tb_type', values)}
              />
            </FormField>

            <FormField label="Pleural Effusion">
              <RadioGroup
                name="pleural_effusion"
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
                value={formData.pleural_effusion}
                onChange={(value) => updateFormData('pleural_effusion', value)}
              />
            </FormField>

            <FormField label="Smear and Culture Results">
              <textarea
                value={formData.smear_culture_results}
                onChange={(e) => updateFormData('smear_culture_results', e.target.value)}
                rows={3}
                placeholder="Text or file upload description"
                className="w-full p-2 border border-gray-300 rounded text-base resize-y"
              />
            </FormField>
          </AccordionSection>

          <AccordionSection title="Risk and Exposure History">
            <FormField label="Exposure History">
              <CheckboxGroup
                name="exposure"
                options={[
                  { value: 'CSW', label: 'Exposure to CSW' },
                  { value: 'Premarital', label: 'Premarital Relations' },
                  { value: 'Extramarital', label: 'Extramarital Relations' }
                ]}
                values={formData.exposure}
                onChange={(values) => updateFormData('exposure', values)}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Sex / Risk Group">
                <select
                  value={formData.sex_risk_group}
                  onChange={(e) => updateFormData('sex_risk_group', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                >
                  <option value="">Select</option>
                  <option value="Heterosexual">Heterosexual</option>
                  <option value="MSM">MSM</option>
                  <option value="IVDA">IVDA</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Transmission Category">
                <select
                  value={formData.transmission_category}
                  onChange={(e) => updateFormData('transmission_category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                >
                  <option value="">Select</option>
                  <option value="Heterosexual">Heterosexual</option>
                  <option value="IVDA">IVDA</option>
                  <option value="Mother-to-Child">Mother-to-Child</option>
                  <option value="Others">Others</option>
                </select>
              </FormField>
            </div>

            <FormField label="HIV Cause Category">
              <CheckboxGroup
                name="hiv_cause"
                options={[
                  { value: 'HIV', label: 'HIV' },
                  { value: 'TB', label: 'TB' },
                  { value: 'HIV+TB', label: 'HIV + TB' }
                ]}
                values={formData.hiv_cause}
                onChange={(values) => updateFormData('hiv_cause', values)}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Last Transfusion Date">
                <input
                  type="date"
                  value={formData.last_transfusion_date}
                  onChange={(e) => updateFormData('last_transfusion_date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>

              <FormField label="Last Transfusion Place">
                <input
                  type="text"
                  value={formData.last_transfusion_place}
                  onChange={(e) => updateFormData('last_transfusion_place', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Occupational Exposure">
                <RadioGroup
                  name="occupational_exposure"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                    { value: 'Unknown', label: 'Unknown' }
                  ]}
                  value={formData.occupational_exposure}
                  onChange={(value) => updateFormData('occupational_exposure', value)}
                />
              </FormField>

              <FormField label="Sexual Partners">
                <RadioGroup
                  name="sexual_partners"
                  options={[
                    { value: '1', label: '1' },
                    { value: '>1', label: 'More than 1' }
                  ]}
                  value={formData.sexual_partners}
                  onChange={(value) => updateFormData('sexual_partners', value)}
                />
              </FormField>

              <FormField label="Tattooed">
                <RadioGroup
                  name="tattooed"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ]}
                  value={formData.tattooed}
                  onChange={(value) => updateFormData('tattooed', value)}
                />
              </FormField>
            </div>
          </AccordionSection>

          <AccordionSection title="HIV-Related Illnesses">
            <FormField label="Illnesses (check all that apply)">
              <CheckboxGroup
                name="illnesses"
                options={[
                  { value: 'Oral Candidiasis', label: 'Oral Candidiasis' },
                  { value: 'Pulmonary TB', label: 'Pulmonary TB' },
                  { value: 'Extra Pulmonary TB', label: 'Extra Pulmonary TB' },
                  { value: 'Pneumonia', label: 'Pneumonia' }
                ]}
                values={formData.illnesses}
                onChange={(values) => updateFormData('illnesses', values)}
              />
            </FormField>

            <FormField label="Other Illnesses">
              <input
                type="text"
                value={formData.other_illnesses}
                onChange={(e) => updateFormData('other_illnesses', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-base"
              />
            </FormField>
          </AccordionSection>

          <AccordionSection title="Treatment Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="ART Type">
                <select
                  value={formData.art_type}
                  onChange={(e) => updateFormData('art_type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                >
                  <option value="">Select</option>
                  <option value="Mono">Mono</option>
                  <option value="Two drugs">Two drugs</option>
                  <option value="HAART">HAART</option>
                  <option value="Modified HAART">Modified HAART</option>
                </select>
              </FormField>

              <FormField label="Date of ART Initiation">
                <input
                  type="date"
                  value={formData.art_initiation_date}
                  onChange={(e) => updateFormData('art_initiation_date', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-base"
                />
              </FormField>
            </div>

            <FormField label="ATT Treatment Details">
              <textarea
                value={formData.att_treatment_details}
                onChange={(e) => updateFormData('att_treatment_details', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded text-base resize-y"
              />
            </FormField>

            <FormField label="Date of ATT Treatment">
              <input
                type="date"
                value={formData.att_treatment_date}
                onChange={(e) => updateFormData('att_treatment_date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-base"
              />
            </FormField>

            <FormField label="Other Treatments">
              <RadioGroup
                name="other_treatments"
                options={[
                  { value: 'Yes', label: 'Yes' },
                  { value: 'No', label: 'No' }
                ]}
                value={formData.other_treatments}
                onChange={(value) => updateFormData('other_treatments', value)}
              />
            </FormField>

            <FormField label="If Yes, Description">
              <textarea
                value={formData.other_treatment_desc}
                onChange={(e) => updateFormData('other_treatment_desc', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded text-base resize-y"
              />
            </FormField>
          </AccordionSection>

          <AccordionSection title="Radiology Findings">
            <FormField label="Radiograph Result">
              <select
                value={formData.radiograph_result}
                onChange={(e) => updateFormData('radiograph_result', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-base"
              >
                <option value="">Select</option>
                <option value="Normal">Normal</option>
                <option value="Abnormal">Abnormal</option>
              </select>
            </FormField>

            {formData.radiograph_result === 'Abnormal' && (
              <div className="mt-4 p-4 border border-gray-300 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Unilateral / Bilateral">
                    <RadioGroup
                      name="unilateral_bilateral"
                      options={[
                        { value: 'Unilateral', label: 'Unilateral' },
                        { value: 'Bilateral', label: 'Bilateral' }
                      ]}
                      value={formData.unilateral_bilateral}
                      onChange={(value) => updateFormData('unilateral_bilateral', value)}
                    />
                  </FormField>

                  <FormField label="Severity">
                    <select
                      value={formData.severity}
                      onChange={(e) => updateFormData('severity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-base"
                    >
                      <option value="">Select</option>
                      <option value="Minimal">Minimal</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Far Advanced">Far Advanced</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Cavity Type">
                    <select
                      value={formData.cavity_type}
                      onChange={(e) => updateFormData('cavity_type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-base"
                    >
                      <option value="">Select</option>
                      <option value="Type 1">Type 1</option>
                      <option value="Type 2">Type 2</option>
                    </select>
                  </FormField>

                  <FormField label="Number of Cavities">
                    <input
                      type="number"
                      value={formData.cavity_number}
                      onChange={(e) => updateFormData('cavity_number', e.target.value)}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded text-base"
                    />
                  </FormField>
                </div>
              </div>
            )}
          </AccordionSection>

          <AccordionSection title="Lab Investigations" defaultOpen>
            <LabInvestigations
              tests={formData.lab_tests}
              onChange={(tests) => updateFormData('lab_tests', tests)}
            />
          </AccordionSection>

          <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isEditing ? 'Update Form' : 'Submit Form'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/files')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
            {submissionTime && (
              <p className="mt-4 text-center text-green-600 font-semibold">
                Form {isEditing ? 'updated' : 'submitted'} at: {submissionTime}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
