import AdminLayout from "../../AdminLayout.jsx";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {useEffect, useRef, useState} from "react";
import axios from 'axios';
import CookieHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {InputText} from "primereact/inputtext";
import {PickList} from "primereact/picklist";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";

const Menu = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "Menu"}
    ];

    const toastRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [menus, setMenus] = useState(null);
    const [assignActionButtons,setAssignActionButtons] = useState(null);
    const [notAssignActionButtons,setNotAssignActionButtons] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [selectedColumnValue, setSelectedColumnValue] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);

    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null
    });

    const columnOptions = [
        { label: 'Menu Name', value: 'menuName' },
        { label: 'Menu Path', value: 'menuPath' }
    ];

    const loadLazyData = (searchTerm) => {
        setLoading(true);

        const params = {
            page: lazyState.page,
            size: lazyState.rows,
            sortField: lazyState.sortField,
            sortOrder: lazyState.sortOrder,
            [selectedColumnValue]: searchTerm || '',
        };

        axios.get('/search_data/search-menus', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: params
        })
            .then(response => {
                setTotalRecords(response.data.totalElements);
                console.log(response)
                setMenus(response.data.content);
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

    useEffect(() => {
        if (!selectedColumnValue || !searchKeyword) {
            loadLazyData(searchKeyword);
        }
    }, [lazyState]);

    const handleSearch = (value) => {
        setSearchKeyword(value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setLazyState(prev => ({
            ...prev,
            first: 0,
            page: 0,
        }));

        const newTimeout = setTimeout(() => {
            if (selectedColumnValue && value) {
                loadLazyData(value);
            }
        }, 500);

        setTypingTimeout(newTimeout);
    };

    const toggleStatus = (rowData) => {
        const updatedStatus = !rowData.isActive;
        axios.put('/crud/menu/change_status',
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
                setMenus(menus.map(menu =>
                    menu.id === rowData.id ? {...menu, isActive: updatedStatus} : menu
                ));
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

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
            <FontAwesomeIcon icon={rowData.iconName}/>
        );
    };

    const onRowEditComplete = (e) => {
        const rowData = e.newData
        console.log(rowData.type, typeof rowData.type)
        axios.put('/crud/menu/update',
            {
                id: rowData.id,
                menuName: rowData.menuName,
                menuPath: rowData.menuPath,
                menuIcon: rowData.iconName
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setMenus((prevMenus) =>
                    prevMenus.map((menu) =>
                        menu.id === rowData.id ? { ...menu, ...rowData } : menu
                    )
                );
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const onRowSelect = (e) => {
        setSelectedMenu(e.data);
        console.log(e.data)
        axios.get('/search_data/menu-action-btn', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                menu_id: e.data.id
            }
        })
            .then(response => {
                setNotAssignActionButtons(response.data.notAssignActionButton)
                setAssignActionButtons(response.data.assignActionButton)
                setVisible(true);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    };

    const saveMapping = () => {
        const payload = {
            menu_id: selectedMenu.id,
            action_buttons: assignActionButtons
        }
        axios.put('/crud/menu/update-action-button', payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                toastRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.data,
                    life: 3000
                });
                setVisible(false);
            })
            .catch(error => {
                toastRef.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.response.data,
                    life: 3000
                });
            });

    };

    const onChange = (event) => {
        setNotAssignActionButtons(event.source);
        setAssignActionButtons(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="d-flex flex-row gap-2 menu-teamplate">
                <FontAwesomeIcon icon={item.action_button_icon}/>
                <div>
                    <p className='m-0'>{item.action_button_name}</p>
                    <p className='m-0'>{item.action_button_path}</p>
                </div>
            </div>
        );
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
                        <FontAwesomeIcon icon={faPlusCircle}/> Add Menu
                    </NavLink>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toastRef}>
            <div className='card'>
                <DataTable value={menus} showGridlines lazy dataKey="id" header={header}
                           paginator paginatorClassName="p-paginator-top"
                           editMode="row" onRowEditComplete={onRowEditComplete}
                           selectionMode="single" onRowSelect={onRowSelect}
                           first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                           onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                           loading={loading} tableStyle={{minWidth: '100%'}}>
                    <Column header="No." body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                            headerStyle={{width: '3rem'}}/>
                    <Column field="menuName" header="Name" sortable
                            editor={(options) => textEditor(options)}/>
                    <Column field="menuPath" header="Path" sortable
                            editor={(options) => textEditor(options)}/>
                    <Column field="iconName" header="Icon" body={iconTemplate}
                            editor={(options) => textEditor(options)}
                            headerStyle={{width: '10%', minWidth: '4rem'}} bodyStyle={{textAlign: 'start'}}/>
                    <Column field="isActive" header="Status" body={isActiveTemplate} sortable
                            headerStyle={{width: '10%', minWidth: '4rem'}} bodyStyle={{textAlign: 'center'}}/>
                    <Column rowEditor={true} headerStyle={{width: '10%', minWidth: '4rem'}}
                            bodyStyle={{textAlign: 'center'}}></Column>
                </DataTable>

                <Dialog
                    header={`Assign action button to menu ${selectedMenu?.menuName}`}
                    visible={visible}
                    style={{width: "50vw"}}
                    modal
                    onHide={() => setVisible(false)}>
                    <PickList
                        source={notAssignActionButtons}
                        target={assignActionButtons}
                        filter filterBy="action_button_name"
                        showSourceControls={false}
                        showTargetControls={false}
                        sourceHeader="Available Action"
                        targetHeader="Selected Action"
                        itemTemplate={itemTemplate}
                        onChange={onChange}
                        dataKey="id" className='myPicker'
                        sourceFilterPlaceholder="Search by name"
                        targetFilterPlaceholder="Search by name"
                    />
                    <div className="p-dialog-footer p-0">
                        <button className="btn btn-primary" type="button" onClick={saveMapping}>
                            Save
                        </button>
                        <button className="btn btn-secondary m-2" type="button" onClick={() => setVisible(false)}>
                            Cancel
                        </button>
                    </div>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

export default Menu;
