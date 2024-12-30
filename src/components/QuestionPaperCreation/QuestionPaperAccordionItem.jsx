import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";

import {QuestionTypes} from "../../Util/AppConstant.jsx";

const QuestionPaperAccordionItem = ({data, selectedQuestions, onSelectionChange, renderHeader, toastRef}) => {
    const MAX_SELECTION = data[0]?.no_of_required_questions;
    const [localSelectedQuestions, setLocalSelectedQuestions] = useState(selectedQuestions.questions);
    const [duplicateWarnings, setDuplicateWarnings] = useState({});

    useEffect(() => {
        setLocalSelectedQuestions(selectedQuestions.questions);
    }, [selectedQuestions]);

    const handleSelectionChange = (e) => {
           const selectedQuestions = e.value;
           console.log(selectedQuestions, data)
           if (selectedQuestions.length <= MAX_SELECTION) {
               const updatedQuestions = selectedQuestions.map(q => ({
                   ...q,
                   questionSerialNumber: q.questionSerialNumber || ''
               }));
               setLocalSelectedQuestions(updatedQuestions);
               onSelectionChange({
                   section_name: data[0]?.section_name,
                   questions: updatedQuestions
               });
           }

    };

    const checkForDuplicates = (value, currentId) => {
        return localSelectedQuestions.some(q =>
            q.id !== currentId && q.questionSerialNumber === value && value !== ''
        );
    };

    const handleSerialNumberChange = (id, value) => {
        const isDuplicate = checkForDuplicates(value, id);
        setDuplicateWarnings(prev => ({
            ...prev,
            [id]: isDuplicate
        }));

        const updatedQuestions = localSelectedQuestions.map(q =>
            q.id === id ? { ...q, questionSerialNumber: value } : q
        );
        setLocalSelectedQuestions(updatedQuestions);
        onSelectionChange({
            section_name: data[0]?.section_name,
            questions: updatedQuestions
        });

        if (isDuplicate) {
            toastRef.current.show({
                severity: 'warn',
                summary: 'Warning',
                detail: 'This Question S.No. is already in use. It may cause confusion in the question paper.',
                life: 3000
            });
        }
    };

    const isSelectionDisabled = (rowData) => {
        return localSelectedQuestions.length >= MAX_SELECTION && !localSelectedQuestions.find(q => q.id === rowData.id);
    };

    const rowClassName = (rowData) => {
        return isSelectionDisabled(rowData) ? 'disabled-row' : '';
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className={`action-body ${isSelectionDisabled(rowData) ? 'disabled' : ''}`}>
            </div>
        );
    };

    const serialNumberBodyTemplate = (rowData, { rowIndex }) => {
        return rowIndex + 1;
    };

    const QuestionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex flex-column gap-2">
                <span>{rowData.question}</span>
                <ol className="questionBodyTemplate-mcq-ol">
                    {rowData.options.map(option =>
                    <li key={option.id}>{option.Option}</li>)}
                </ol>
            </div>
        );
    }

    const OtherQuestionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex flex-column gap-2">
                <span>{rowData.question}</span>
            </div>
        );
    }

    const questionSerialNumberBodyTemplate = (rowData) => {
        const selectedQuestion = localSelectedQuestions.find(q => q.id === rowData.id);
        return (
            <div className="d-flex">
                <InputText
                    className={`col-md-5 ${duplicateWarnings[rowData.id] ? 'p-invalid' : ''}`}
                    value={selectedQuestion ? selectedQuestion.questionSerialNumber : ''}
                    maxLength={2}
                    onChange={(e) => handleSerialNumberChange(rowData.id, e.target.value)}
                    disabled={!selectedQuestion}
                />
            </div>
        );
    }

    return (
          <DataTable value={data[0]?.questions} paginator header={renderHeader} rows={10} paginatorClassName='paginator_css'
                     paginatorTemplate="CurrentPageReport PrevPageLink PageLinks NextPageLink"
                     dataKey="id" selection={localSelectedQuestions}
                     onSelectionChange={handleSelectionChange} selectionMode="multiple"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                     rowClassName={rowClassName}
                     rowSelectionDisabled={(rowData) => isSelectionDisabled(rowData)}
                     emptyMessage="No questions found.">
              <Column header="S.No" body={serialNumberBodyTemplate} className="col-sm-1" />
              <Column selectionMode="multiple" headerClassName="selectionHeader" className="col-sm-1" body={actionBodyTemplate}></Column>
              <Column header="Question S.No" className="col-sm-2" body={questionSerialNumberBodyTemplate} />
              {data[0]?.type===QuestionTypes.MCQ?
                  <Column field="question" header="Question" body={QuestionBodyTemplate} /> : <Column field="questions" header="Question" body={OtherQuestionBodyTemplate} />}
          </DataTable>
    );
};

QuestionPaperAccordionItem.propTypes = {
    data: PropTypes.array.isRequired,
    selectedQuestions: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    renderHeader: PropTypes.func.isRequired,
    toastRef: PropTypes.object.isRequired
}

export default QuestionPaperAccordionItem