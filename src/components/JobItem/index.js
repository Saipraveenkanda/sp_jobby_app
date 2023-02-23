import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {GrMail} from 'react-icons/gr'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="link-style">
      <li className="each-job-item">
        <div className="name-logo-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-card">
              <AiFillStar className="star" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="loc-type-sal-card">
          <div className="loc-type">
            <div className="loc-card">
              <MdLocationOn className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="type-card">
              <GrMail className="type-icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <div className="package-card">
            <p className="package">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="hr-line" />
        <h1 className="desc-heading">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItem
