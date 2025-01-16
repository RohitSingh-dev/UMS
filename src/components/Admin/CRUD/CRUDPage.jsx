import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import AdminLayout from "../AdminLayout.jsx";
import {useEffect, useState} from "react";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlusCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import apiCall from "../../../Axios/APIHelper.jsx";
import Notiflix from 'notiflix';
import customLoader from "../../../Util/CustomLoader.jsx";

const CRUDPage = ({entityName, apiEndpoints, columns, searchConfig, isEditable}) => {

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: entityName}
    ];
    const [selectedRow, setSelectedRow] = useState(null)
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [records, setRecords] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(
        searchConfig.type === 'column' ? searchConfig.columns[0] : null
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen((prevState) => !prevState);
    };

    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {},
    });

    // Handle dropdown selection
    const handleColumnChange = (e) => {
        const selectedOption = searchConfig.columns.find((col) => col.value === e.value);
        setSelectedColumn(selectedOption); // Store the full object (or at least the label)
        setSearchValue(''); // Clear the search value when the column changes
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            let newFilters = {};

            if (searchConfig.type === 'global') {
                // For global search, apply the search value to all specified fields
                searchConfig.fields.forEach(field => {
                    newFilters[field] = {value: searchValue, matchMode: 'contains'};
                });
            } else if (searchConfig.type === 'column' && selectedColumn) {
                // For column search, only apply to selected column
                newFilters[selectedColumn.value] = {value: searchValue, matchMode: 'contains'};
            }

            setLazyState(prevState => ({
                ...prevState,
                filters: newFilters,
                page: 0,
            }));
        }, 500);

        return () => clearTimeout(delay);
    }, [searchValue, selectedColumn]);

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    const loadLazyData = () => {
        setLoading(true);
        console.log("lazyState: ",lazyState)

        const filters = lazyState.filters || {}; // Ensure filters is an object

        console.log("works: ",filters)

// Safely map over the filters and ensure each filter has a 'value' property
        const filterParams = Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [
                key,
                value && value.value !== undefined ? value.value : ''
            ])
        );

        console.log("filters: ",filterParams)


        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            ...filterParams,
        };
        console.log("Params: ", params)

        apiCall({
            url: apiEndpoints.fetch,
            params: params,
            showLoadingIndicator: false
        }).then((response) => {
            setTotalRecords(response.totalRecords);
            setRecords(response.content);
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    const toggleStatus = (rowData) => {
        const updatedStatus = !rowData.is_active;
        apiCall({
            url: apiEndpoints.toggleStatus,
            data: {id: rowData.id, is_active: updatedStatus},
            showLoadingIndicator: false
        }).then(() => {
            setRecords(
                records.map((record) =>
                    record.id === rowData.id ? {...record, is_active: updatedStatus} : record
                )
            );
        })
            .catch((error) => {
                console.error("Error updating status:", error);
            });
    };

    const onRowEditComplete = (e) => {
        const {newData} = e;

        apiCall({
            url: apiEndpoints.editRecord.replace(':id', newData.id),
            method: "PUT",
            data: newData,
            showLoadingIndicator: false
        }).then(() => {
            setRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === newData.id ? {...record, ...newData} : record
                )
            );
        })
            .catch(error => {
                console.error("Error updating record:", error);
            });
    };

    const onPage = (event) => {
        setLazyState((prevState) => ({...prevState, ...event}))
        console.log("pagging wroked" , event)
    };

    const onSort = (event) => setLazyState((prevState) => ({...prevState, ...event}));

    const isActiveTemplate = (rowData) => {
        return (
            <button className={`btn ${rowData.isActive ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleStatus(rowData)}>
                {rowData.isActive ? 'Active' : 'Inactive'}
            </button>
        );
    };

    const iconTemplate = (rowData) => {
        return (
            <FontAwesomeIcon icon={rowData.icon}/>
        );
    };

    const textEditor = (options) => {
        return <InputText type="text" name={options.field} value={options.value}
                          onChange={(e) => options.editorCallback(e.target.value)}/>;
    };

    const renderHeader = () => (
        <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-3">
                {searchConfig.type === 'column' && (
                    <Dropdown
                        value={selectedColumn?.value}
                        options={searchConfig.columns}
                        onChange={handleColumnChange}
                        placeholder="Select Column"
                        optionLabel="label"
                        className="w-200px"
                    />
                )}
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"/>
                    <InputText
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={`Search ${searchConfig.type === 'column' ? 'by ' + selectedColumn?.label : ''}`}
                    />
                </IconField>
            </div>
            <div>
                {entityName === 'Registration' ? (
                    <div className="dropdown-container">
                        <button
                            className="btn btn-primary-violet mb-4 dropdown-toggle"
                            onClick={toggleDropdown}
                        >
                            <FontAwesomeIcon icon={faPlusCircle}/> Add&nbsp;{entityName}
                        </button>
                        {dropdownOpen && (
                            <div className={`dropdown-menu ${dropdownOpen ? 'd-block' : 'd-none'}`}
                                 style={{top: "56px", right: "18px"}}>
                                <NavLink to="add-by-course"
                                         onClick={() => setDropdownOpen(false)}
                                         className="dropdown-item">Add by Course</NavLink>
                                <NavLink to="add-by-student"
                                         onClick={() => setDropdownOpen(false)}
                                         className="dropdown-item">Add by Student</NavLink>
                            </div>
                        )}
                    </div>
                ) : (
                    <NavLink to="add" className="btn btn-primary-violet mb-4">
                        <FontAwesomeIcon icon={faPlusCircle}/> Add&nbsp;{entityName}
                    </NavLink>
                )}
            </div>
        </div>
    );

    const header = renderHeader();

    const getColBody = (col) => {
        if (col.field === 'is_active' || col.field === 'isActive') {
            return isActiveTemplate
        }
        if (col.field === 'icon') {
            return iconTemplate
        }
        return col.body
    }

    const deleteTemplate = (rowData) => {
        const onDeleteClick = () => {
            setSelectedRow(rowData.id)
            Notiflix.Confirm.show(
                'Confirm Deletion',
                `Are you sure you want to delete this ${entityName} ?`,
                'Yes, Delete',
                'Cancel',
                () => {
                    apiCall({
                        url: `${apiEndpoints.delete}?id=${rowData.id}`,
                        method: "DELETE",
                        showLoadingIndicator: false,
                    })
                        .then(() => {
                            setRecords((prevRecords) =>
                                prevRecords.filter((record) => record.id !== rowData.id)
                            );
                            setTotalRecords((prevTotal) => prevTotal - 1);
                            Notiflix.Notify.success('Record deleted successfully!');
                        })
                        .catch((error) => {
                            console.error("Error deleting record:", error);
                            Notiflix.Notify.failure('Failed to delete the record. Please try again.');
                        })
                        .finally(() => {
                            setSelectedRow(null)
                        })
                    ;
                },
                () => {
                    Notiflix.Notify.info('Deletion cancelled.');
                    setSelectedRow(null)
                },
                {
                    width: '320px',
                    borderRadius: '8px',
                    buttonsFontSize: '14px',
                }
            );
        };

        return (
            <div style={{cursor: 'pointer'}}>
                <FontAwesomeIcon icon={faTrash} onClick={onDeleteClick} className="text-danger"></FontAwesomeIcon>
            </div>
        );
    };

    const editTemplateAndRedirect = (rowData) => {

        return (
            <NavLink to='add' state={rowData} className="color-gray">
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
            </NavLink>
        );
    };

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className="card">
                <DataTable value={records} showGridlines lazy dataKey="id"
                           paginator paginatorClassName="p-paginator-top"
                           header={header} editMode="row" first={lazyState.first}
                           rows={10} totalRecords={totalRecords}
                           onPage={onPage} onSort={onSort}
                           onRowEditComplete={onRowEditComplete} loadingIcon={customLoader}
                           sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                           rowClassName={rowData => rowData.id === selectedRow ? 'highlight-row' : 'row-hover'}
                           loading={loading} tableStyle={{minWidth: '100%'}}>
                    <Column header="No."
                            body={(rowData, options) => options.rowIndex + 1}
                            headerStyle={{width: '3rem'}}
                    />
                    {columns.map((col, index) => (
                        <Column key={index}
                                field={col.field}
                                header={col.header}
                                sortable={col.sortable}
                                body={getColBody(col)}
                                editor={col.editor && ((options) => textEditor(options))}
                                headerStyle={col.headerStyle}
                                bodyStyle={col.bodyStyle}
                        />
                    ))}
                    {isEditable && columns.length < 5 && (
                        <Column rowEditor header="Edit" headerStyle={{width: '10%', minWidth: '4rem'}}></Column>
                    )}
                    {isEditable && columns.length >= 5 && (
                        <Column header="Edit"
                                headerStyle={{width: '10%', minWidth: '4rem'}}
                                body={editTemplateAndRedirect}></Column>
                    )}
                    <Column header="Delete"
                            headerStyle={{width: '10%', minWidth: '4rem'}}
                            body={deleteTemplate}></Column>
                </DataTable>
            </div>
        </AdminLayout>
    );
};
CRUDPage.propTypes = {
    entityName: PropTypes.string.isRequired,
    apiEndpoints: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    searchConfig: PropTypes.shape({
        type: PropTypes.oneOf(['global', 'column']).isRequired,
        fields: PropTypes.arrayOf(PropTypes.string),
        columns: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        }))
    }).isRequired,
    isEditable: PropTypes.bool.isRequired
}

export default CRUDPage;
