import {Link, withRouter} from 'react-router-dom'
import {AiFillHome} from 'react-icons/ai'
import {GrMail} from 'react-icons/gr'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/" className="link-style">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo-header"
        />
      </Link>
      <ul className="routing-items-cont">
        <Link to="/" className="link-style">
          <li className="nav-item">Home</li>
        </Link>
        <Link to="/jobs" className="link-style">
          <li className="nav-item">Jobs</li>
        </Link>
      </ul>
      <button className="logout-btn" type="button" onClick={onLogout}>
        Logout
      </button>
      <ul className="mobile-nav-container">
        <Link to="/">
          <li className="nav-item">
            <button className="mobile-nav-btn" type="button">
              <AiFillHome className="nav-icon" />
            </button>
          </li>
        </Link>
        <Link to="/jobs">
          <li className="nav-item">
            <button className="mobile-nav-btn" type="button">
              <GrMail className="nav-icon" />
            </button>
          </li>
        </Link>
        <li className="nav-item">
          <button className="mobile-nav-btn" type="button" onClick={onLogout}>
            <FiLogOut className="nav-icon" />
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
