import AdminLayout from "../../AdminLayout.jsx";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Dropdown} from "primereact/dropdown";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import apiCall from "../../../../Axios/APIHelper.jsx";
import CustomLoader from "../../../Util/CustomeLoader.jsx";

const ActionButton = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Action Button"}
    ];

    const toastRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [actionButtons, setActionButtons] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [selectedColumnValue, setSelectedColumnValue] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);

    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
    });

    const columnOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Path', value: 'action_button_path' }
    ];

    useEffect(() => {
        if (!selectedColumnValue || !searchKeyword) {
            loadLazyData(searchKeyword);
        }
    }, [lazyState]);

    const loadLazyData = (searchTerm) => {
        setLoading(true);

        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            [selectedColumnValue]: searchTerm || '',
        };

        apiCall({
            url:'/search_data/action-button/search',
            params: params,
            showLoadingIndicator: false
        })
            .then(data => {
                setTotalRecords(data.total_elements);
                setActionButtons(data.content);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });

    };

    const onPage = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };

    const onSort = (event) => {
        setLazyState(prevState => ({...prevState, ...event}));
    };

    const handleSearch = (value) => {
        setSearchKeyword(value);

        // Clear any existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setLazyState(prev => ({
            ...prev,
            first: 0,
            page: 0,
        }));

        // Set new timeout
        const newTimeout = setTimeout(() => {
            if (selectedColumnValue && value) {
                loadLazyData(value);
            }
        }, 500);

        setTypingTimeout(newTimeout);
    };

    const toggleStatus = (rowData) => {
        const updatedStatus = !rowData.isActive;
        axios.put('/crud/action-button/change_status',
            {
                id: rowData.id,
                isActive: updatedStatus
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setActionButtons(actionButtons.map(actionButton =>
                    actionButton.id === rowData.id ? {...actionButton, isActive: updatedStatus} : actionButton
                ));
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const isActiveTemplate = (rowData) => {
        console.log(rowData)
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

    const onRowEditComplete = (e) => {
        const rowData = e.newData
        console.log(rowData.type, typeof rowData.type)
        axios.put('/crud/action-button/update',
            {
                id: rowData.id,
                name: rowData.name,
                action_button_path: rowData.action_button_path,
                icon: rowData.icon
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setActionButtons((prevActionButtons) =>
                    prevActionButtons.map((actionButton) =>
                        actionButton.id === rowData.id ? { ...actionButton, ...rowData } : actionButton  // Update the entire row with new data
                    )
                );
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)}/>;
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <Dropdown
                        value={selectedColumn}
                        options={columnOptions}
                        onChange={(e) => {
                            setSelectedColumn(e.value);
                            setSelectedColumnValue(e.value.value);
                            setSearchKeyword(''); // Clear search keyword on column change
                            loadLazyData('');  // Clear search results when changing column
                        }}
                        placeholder="Select Column" optionLabel="label"
                        className="w-200px"
                    />
                    <IconField iconPosition="right">
                        <InputText value={searchKeyword}
                                   onChange={(e) => handleSearch(e.target.value)}
                                   placeholder="Search" />
                        <InputIcon className="pi pi-search"/>
                    </IconField>
                </div>
                <div>
                    <NavLink to="add" className="btn btn-primary-violet mb-4">
                        <FontAwesomeIcon icon={faPlusCircle}/> Add Action Button
                    </NavLink>
                </div>
            </div>
        );
    };

    const header = renderHeader();

  return (
      <AdminLayout breadcrumbItems={breadcrumbData} toast={toastRef}>
          <div className='card'>
              <DataTable value={actionButtons} showGridlines lazy filterDisplay="row" dataKey="id"
                         header={header} paginator paginatorClassName="p-paginator-top"
                         editMode="row" onRowEditComplete={onRowEditComplete} loadingIcon={<CustomLoader/>}
                         first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                         onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                         loading={loading} tableStyle={{minWidth: '100%'}}>
                  <Column header="No." body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                          headerStyle={{width: '3rem'}}/>
                  <Column field="name" header="Name" sortable
                          editor={(options) => textEditor(options)}
                          showFilterMenu={false}/>
                  <Column field="path" header="Path" sortable
                          editor={(options) => textEditor(options)}
                          showFilterMenu={false}/>
                  <Column field="icon" header="Icon" body={iconTemplate}
                          editor={(options) => textEditor(options)}
                          headerStyle={{width: '10%', minWidth: '4rem'}} bodyStyle={{textAlign: 'start'}}/>
                  <Column field="isActive" header="Status" body={isActiveTemplate} sortable
                          headerStyle={{width: '10%', minWidth: '4rem'}} bodyStyle={{textAlign: 'center'}}/>
                  <Column rowEditor={true} headerStyle={{width: '10%', minWidth: '4rem'}}
                          bodyStyle={{textAlign: 'center'}}></Column>
              </DataTable>
          </div>
      </AdminLayout>
  )
}

export default ActionButton