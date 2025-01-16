import AdminLayout from "../../AdminLayout.jsx";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {useEffect, useRef, useState} from "react";
import axios from 'axios';
import CookieHelper from "../../../../services/UseCookies.jsx";
import {Dialog} from "primereact/dialog";
import {PickList} from "primereact/picklist";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {JWT_COOKIES_NAME} from "../../../../Util/AppConstant.jsx";
import {NavLink} from "react-router-dom";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";


const RoleMenuMapping = () => {
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [menus, setMenus] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedAuthority, setSelectedAuthority] = useState(null);
    const [roleMenu, setRoleMenu] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        sortField: null,
        sortOrder: null,
        filters: {
            authority: {value: '', matchMode: 'contains'},
        }
    });
    const toastRef = useRef(null);

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "Master Settings", url: '/admin/crud'},
        {name: "Role User Mapping"}
    ];

    useEffect(() => {
        const delay = setTimeout(() => {
            // Update lazy state only after user has stopped typing
            setLazyState((prevState) => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    authority: {value: globalFilterValue, matchMode: 'contains'}, // Update filter for 'type' field
                },
                page: 0, // Reset to the first page on a new search
            }));
        }, 500); // 500ms delay

        return () => clearTimeout(delay); // Clear timeout if the component re-renders
    }, [globalFilterValue]); // Only trigger when globalFilterValue changes

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
            authority: lazyState.filters.authority.value || '',
        };

        axios.get('/search_data/roles', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: params
        })
            .then(response => {
                setTotalRecords(response.data.totalElements);
                setRoles(response.data.content);
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

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value); // Update the input value state
    };

    const onRowSelect = (e) => {
        setSelectedAuthority(e.data);
        axios.get('/search_data/role-menu', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: e.data.id
            }
        })
            .then(response => {
                setMenus(response.data.notAssignMenu)
                setRoleMenu(response.data.assignMenu)
                setVisible(true);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    };

    const saveMapping = () => {
        console.log("Updated authors for book:", roleMenu, "and seleted authority", selectedAuthority.id);
        const payload = {
            id: selectedAuthority.id,
            menus: roleMenu
        }
        axios.put('/crud/role/update-menu', payload, {
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
        setMenus(event.source);
        setRoleMenu(event.target);
    };

    const itemTemplate = (item) => {
        return (
            <div className="d-flex flex-row gap-2 menu-teamplate">
                <FontAwesomeIcon icon={item.icon}/>
                <div>
                    <p className='m-0'>{item.name}</p>
                    <p className='m-0'>{item.path}</p>
                </div>
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search Role" />
                    </IconField>
                </div>
                <div>
                    <NavLink to="add" className="btn btn-primary-violet mb-4">
                        <FontAwesomeIcon icon={faPlusCircle}/> Add Role
                    </NavLink>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <AdminLayout breadcrumbItems={breadcrumbData} toast={toastRef}>
            <div className='card'>
                <DataTable value={roles} showGridlines header={header}
                           selectionMode="single" onRowSelect={onRowSelect}
                           tableStyle={{minWidth: '100%'}} paginatorClassName="p-paginator-top"
                           lazy dataKey="id" paginator editMode="row"
                           first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                           sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                           globalFilterFields={['authority']} loading={loading}>
                    <Column header="No." body={(rowData, options) => options.rowIndex + 1}
                            headerStyle={{width: '3rem'}}/>
                    <Column field="authority" header="Role"/>
                </DataTable>

                <Dialog
                    header={`Assign menus for role ${selectedAuthority?.authority}`}
                    visible={visible}
                    style={{width: "50vw"}}
                    modal
                    onHide={() => setVisible(false)}>
                    <PickList
                        source={menus}
                        target={roleMenu}
                        filter filterBy="name"
                        showSourceControls={false}
                        showTargetControls={false}
                        sourceHeader="Available Menus"
                        targetHeader="Selected Menus"
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
};

export default RoleMenuMapping;
