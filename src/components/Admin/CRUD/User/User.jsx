import AdminLayout from "../../AdminLayout.jsx";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {useEffect, useState} from "react";
import axios from 'axios';
import CookiesHelper from "../../../../services/UseCookies.jsx";
import {JWT_COOKIES_NAME} from "../../../Util/AppConstant.jsx";
import {InputText} from "primereact/inputtext";
import {IconField} from 'primereact/iconfield';
import {InputIcon} from 'primereact/inputicon';
import {Dropdown} from 'primereact/dropdown';

const User = () => {
    const token = CookiesHelper.getCookie(JWT_COOKIES_NAME);

    const breadcrumbData = [
        {name: "Dashboard", url: '/admin/dashboard'},
        {name: "CRUD", url: '/admin/crud'},
        {name: "User"}
    ];

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [user, setUser] = useState(null);
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
        { label: 'Mobile', value: 'mobile' },
        { label: 'Username', value: 'userName' },
        { label: 'Designation', value: 'designation' }
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
        console.log(selectedColumnValue, searchTerm)

        axios.get('/admin/search-user', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            params: params
        })
            .then(response => {
                setTotalRecords(response.data.totalElements);
                console.log(response)
                setUser(response.data.content);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
                setLoading(false);
            });
    };

    const onPage = (e) => {
        setLazyState({
            ...lazyState,
            first: e.first,
            page: e.page,
        });
    };

    useEffect(() => {
        if (!selectedColumnValue || !searchKeyword) {
            loadLazyData(searchKeyword);
        }
    }, [lazyState]);


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

    const onSort = (event) => {
        const sortedData = [...user].sort((a, b) => {
            const valueA = a[event.sortField];
            const valueB = b[event.sortField];

            // Handle null/undefined cases
            if (valueA == null) return event.sortOrder;
            if (valueB == null) return -event.sortOrder;

            // Handle sorting of strings and numbers
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return event.sortOrder * valueA.localeCompare(valueB);
            } else {
                return event.sortOrder * (valueA < valueB ? -1 : (valueA > valueB ? 1 : 0));
            }
        });

        // Update the sorted user list and lazyState
        setUser(sortedData);
        setLazyState((prevState) => ({
            ...prevState,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        }));
    };

    const allowEdit = (rowData) => {
        return rowData.name !== 'Blue Band';
    };

    const onRowEditComplete = (e) => {
        const rowData = e.newData
        console.log(rowData.type, typeof rowData.type)
        axios.put(`/crud/question_type/${rowData.id}/update_type`,
            rowData.type,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                setUser(user.map(customer =>
                    customer.id === rowData.id ? {...customer, type:  rowData.type} : customer
                ));
            })
            .catch(error => {
                console.error("Error updating status:", error);
            });
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
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
                            setSelectedColumnValue(e.value);
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
                        <FontAwesomeIcon icon={faPlusCircle}/> Add User
                    </NavLink>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <AdminLayout breadcrumbItems={breadcrumbData}>
            <div className='card'>
                <DataTable value={user} showGridlines lazy dataKey="id" header={header}
                           paginator paginatorClassName="p-paginator-top"
                           editMode="row" onRowEditComplete={onRowEditComplete}
                           first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                           sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
                           loading={loading} onSort={onSort} tableStyle={{minWidth: '100%'}}>
                    <Column header="No." body={(rowData, options) => lazyState.first + options.rowIndex + 1}
                            headerStyle={{width: '3rem'}}/>
                    <Column field="name" header="Name" sortable editor={(options) => textEditor(options)}
                            showFilterMenu={false}/>
                    <Column field="mobile" header="Mobile" sortable editor={(options) => textEditor(options)}
                            showFilterMenu={false}/>
                    <Column field="userName" header="User Name" sortable editor={(options) => textEditor(options)}
                            showFilterMenu={false}/>
                    <Column field="userPersonalDetail.designation.name" header="Designation" sortable editor={(options) => textEditor(options)}
                            showFilterMenu={false}/>
                    <Column rowEditor={allowEdit} header="Action" headerStyle={{ width: '10%', minWidth: '4rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </div>
        </AdminLayout>
    );
}

export default User;
