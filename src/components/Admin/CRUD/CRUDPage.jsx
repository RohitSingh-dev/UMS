import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import AdminLayout from "../AdminLayout.jsx";
import CookieHelper from "../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import apiCall from "../../../Axios/APIHelper.jsx";

const CRUDPage = ({entityName, apiEndpoints, columns, searchConfig, isEditable}) => {

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: entityName}
    ];
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [records, setRecords] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(
        searchConfig.type === 'column' ? searchConfig.columns[0].value : null
    );
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {},
    });

    useEffect(() => {
        const delay = setTimeout(() => {
            let newFilters = {};

            if (searchConfig.type === 'global') {
                // For global search, apply the search value to all specified fields
                searchConfig.fields.forEach(field => {
                    newFilters[field] = { value: searchValue, matchMode: 'contains' };
                });
            } else if (searchConfig.type === 'column' && selectedColumn) {
                // For column search, only apply to selected column
                newFilters[selectedColumn] = { value: searchValue, matchMode: 'contains' };
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

        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            ...Object.fromEntries(
                Object.entries(lazyState.filters).map(([key, value]) => [key, value.value || ''])
            ),
        };

        apiCall({
            url: apiEndpoints.fetch,
            params: params,
            showLoadingIndicator: false
        }).then((response) => {
                setTotalRecords(response.data.total_elements);
                setRecords(response.data.content);
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
            url:apiEndpoints.toggleStatus,
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
        const { newData } = e;

        apiCall({
            url:apiEndpoints.editRecord.replace(':id', newData.id),
            data: newData,
            showLoadingIndicator: false
        }).then(() => {
                setRecords(prevRecords =>
                    prevRecords.map(record =>
                        record.id === newData.id ? { ...record, ...newData } : record
                    )
                );
            })
            .catch(error => {
                console.error("Error updating record:", error);
            });
    };

    const onPage = (event) => setLazyState((prevState) => ({ ...prevState, ...event }));

    const onSort = (event) => setLazyState((prevState) => ({ ...prevState, ...event }));

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
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    const renderHeader = () => (
        <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-3">
                {searchConfig.type === 'column' && (
                    <Dropdown
                        value={selectedColumn}
                        options={searchConfig.columns}
                        onChange={(e) => {
                            setSelectedColumn(e.value);
                            setSearchValue('');
                        }}
                        placeholder="Select Column"
                        optionLabel="label"
                        className="w-200px"
                    />
                )}
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={`Search ${searchConfig.type === 'column' ? 'by ' + selectedColumn : ''}`}
                    />
                </IconField>
            </div>
            <div>
                <NavLink to="add" className="btn btn-primary-violet mb-4">
                    <FontAwesomeIcon icon={faPlusCircle} /> Add&nbsp;{entityName}
                </NavLink>
            </div>
        </div>
    );

    const header = renderHeader();

    const getColBody = (col) => {
      if(col.field === 'is_active' || col.field === 'isActive') { return isActiveTemplate }
      if(col.field === 'icon') { return iconTemplate }
      return col.body
    }

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className="card">
                <DataTable value={records} showGridlines lazy dataKey="id"
                    paginator paginatorClassName="p-paginator-top"
                    header={header} editMode="row" first={lazyState.first}
                    rows={10} totalRecords={totalRecords}
                    onPage={onPage} onSort={onSort} onRowEditComplete={onRowEditComplete}
                    sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                    loading={loading} tableStyle={{minWidth: '100%'}}>
                    <Column
                        header="No."
                        body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                        headerStyle={{width: '3rem'}}
                    />
                    {columns.map((col, index) => (
                        <Column
                            key={index}
                            field={col.field}
                            header={col.header}
                            sortable={col.sortable}
                            body={getColBody(col)}
                            editor={col.editor && ((options) => textEditor(options))}
                            headerStyle={col.headerStyle}
                            bodyStyle={col.bodyStyle}
                        />
                    ))}
                    {isEditable && (
                        <Column rowEditor={allowEdit} header="Action" headerStyle={{width: '10%', minWidth: '4rem'}}
                                bodyStyle={{textAlign: 'center'}}></Column>
                    )}
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
