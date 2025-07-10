
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface LabTest {
  date: string;
  cd4: string;
  viral_load: string;
  hemoglobin: string;
  tlc: string;
  alc: string;
  platelets: string;
  esr: string;
  blood_glucose_f: string;
  blood_glucose_pp: string;
  blood_glucose_r: string;
  urea: string;
  creatinine: string;
  sodium: string;
  potassium: string;
  calcium: string;
  phosphate: string;
  bilirubin: string;
  ast: string;
  alt: string;
  alp: string;
  albumin: string;
  globulin: string;
  hbsag: boolean;
  anti_hcv: boolean;
}

interface LabInvestigationsProps {
  tests: LabTest[];
  onChange: (tests: LabTest[]) => void;
}

const defaultTest: LabTest = {
  date: '',
  cd4: '',
  viral_load: '',
  hemoglobin: '',
  tlc: '',
  alc: '',
  platelets: '',
  esr: '',
  blood_glucose_f: '',
  blood_glucose_pp: '',
  blood_glucose_r: '',
  urea: '',
  creatinine: '',
  sodium: '',
  potassium: '',
  calcium: '',
  phosphate: '',
  bilirubin: '',
  ast: '',
  alt: '',
  alp: '',
  albumin: '',
  globulin: '',
  hbsag: false,
  anti_hcv: false,
};

export const LabInvestigations: React.FC<LabInvestigationsProps> = ({ tests, onChange }) => {
  const addNewTest = () => {
    onChange([...tests, { ...defaultTest }]);
  };

  const updateTest = (index: number, field: keyof LabTest, value: string | boolean) => {
    const newTests = [...tests];
    newTests[index] = { ...newTests[index], [field]: value };
    onChange(newTests);
  };

  const parameters = [
    { key: 'date' as keyof LabTest, label: 'Date', type: 'date' },
    { key: 'cd4' as keyof LabTest, label: 'CD4', type: 'number', tooltip: 'CD4 count = immune strength' },
    { key: 'viral_load' as keyof LabTest, label: 'Viral Load', type: 'number' },
    { key: 'hemoglobin' as keyof LabTest, label: 'Hemoglobin', type: 'number', step: '0.1' },
    { key: 'tlc' as keyof LabTest, label: 'TLC', type: 'number' },
    { key: 'alc' as keyof LabTest, label: 'ALC', type: 'number' },
    { key: 'platelets' as keyof LabTest, label: 'Platelets', type: 'number' },
    { key: 'esr' as keyof LabTest, label: 'ESR', type: 'number' },
    { key: 'blood_glucose_f' as keyof LabTest, label: 'Blood Glucose (F)', type: 'number', step: '0.1' },
    { key: 'blood_glucose_pp' as keyof LabTest, label: 'Blood Glucose (PP)', type: 'number', step: '0.1' },
    { key: 'blood_glucose_r' as keyof LabTest, label: 'Blood Glucose (R)', type: 'number', step: '0.1' },
    { key: 'urea' as keyof LabTest, label: 'Urea', type: 'number', step: '0.1' },
    { key: 'creatinine' as keyof LabTest, label: 'Creatinine', type: 'number', step: '0.1' },
    { key: 'sodium' as keyof LabTest, label: 'Sodium', type: 'number', step: '0.1' },
    { key: 'potassium' as keyof LabTest, label: 'Potassium', type: 'number', step: '0.1' },
    { key: 'calcium' as keyof LabTest, label: 'Calcium', type: 'number', step: '0.1' },
    { key: 'phosphate' as keyof LabTest, label: 'Phosphate', type: 'number', step: '0.1' },
    { key: 'bilirubin' as keyof LabTest, label: 'Bilirubin', type: 'number', step: '0.1' },
    { key: 'ast' as keyof LabTest, label: 'AST', type: 'number', step: '0.1' },
    { key: 'alt' as keyof LabTest, label: 'ALT', type: 'number', step: '0.1' },
    { key: 'alp' as keyof LabTest, label: 'ALP', type: 'number', step: '0.1' },
    { key: 'albumin' as keyof LabTest, label: 'Albumin', type: 'number', step: '0.1' },
    { key: 'globulin' as keyof LabTest, label: 'Globulin', type: 'number', step: '0.1' },
    { key: 'hbsag' as keyof LabTest, label: 'HBsAg', type: 'checkbox' },
    { key: 'anti_hcv' as keyof LabTest, label: 'anti-HCV', type: 'checkbox' },
  ];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-5">
          <thead>
            <tr>
              <th className="bg-gray-100 font-semibold p-3 text-left border border-gray-300 w-40">
                Parameter
              </th>
              {tests.map((_, index) => (
                <th key={index} className="bg-gray-100 font-semibold p-3 text-center border border-gray-300 min-w-32">
                  Test {index + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parameters.map((param) => (
              <tr key={param.key} className="even:bg-gray-50">
                <th className="bg-gray-100 font-semibold p-3 text-left border border-gray-300 align-top">
                  {param.label}
                  {param.tooltip && (
                    <span 
                      className="ml-2 text-blue-600 cursor-help border-b border-dotted border-gray-500"
                      title={param.tooltip}
                    >
                      ?
                    </span>
                  )}
                </th>
                {tests.map((test, testIndex) => (
                  <td key={testIndex} className="p-2 border border-gray-300 align-top">
                    {param.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={test[param.key] as boolean}
                        onChange={(e) => updateTest(testIndex, param.key, e.target.checked)}
                        className="scale-125"
                      />
                    ) : (
                      <input
                        type={param.type}
                        value={test[param.key] as string}
                        onChange={(e) => updateTest(testIndex, param.key, e.target.value)}
                        step={param.step}
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        type="button"
        onClick={addNewTest}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-5 py-3 text-base font-bold rounded-full cursor-pointer mt-4 shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <Plus size={20} />
        Add New Test
      </button>
    </div>
  );
};
