import PreviousBreadcrumbItem from "./PreviousBreadcrumbItem.jsx";
import ActiveBreadcrumbItem from "./ActiveBreadcrumbItem.jsx";
import PropTypes from "prop-types";

const Breadcrumb = ({breadcrumbItems, header}) => {
    const lastItemName = breadcrumbItems[breadcrumbItems.length - 1]?.name || "";

    return (
        <div className="page-header">
            <div className="row">
                <div className="col-sm-12">
                    <ul className="breadcrumb">
                        {breadcrumbItems.map((item, index) => {
                            // Check if the current item is the last in the list
                            const isLastItem = index === breadcrumbItems.length - 1;

                            return isLastItem ? (
                                <ActiveBreadcrumbItem key={index} name={item.name}/>
                            ) : (
                                <PreviousBreadcrumbItem key={index} name={item.name} url={item.url}/>
                            );
                        })}
                    </ul>
                    <h3 className="page-title dashboard-page-title">{header || lastItemName}</h3>
                </div>
            </div>
        </div>
    )
}

Breadcrumb.propTypes = {
    breadcrumbItems: PropTypes.array.isRequired,
    header: PropTypes.string
};

export default Breadcrumb;
