import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SearchBar() {
  return (

    <div className="top-nav-search">
        <form>
            <input type="text" className="form-control" placeholder="Search here"></input>
                <button className="btn" type="submit"><FontAwesomeIcon icon={faSearch} /></button>
        </form>
    </div>

  );
}

export default SearchBar;
