import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {GrMail} from 'react-icons/gr'
import {BiLinkExternal} from 'react-icons/bi'

import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    skillsList: [],
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.pending})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updatedJobDetailsData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
      }
      const skillsList = updatedJobDetailsData.skills
      const updatedSkillsList = skillsList.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const updatedSimilarJobsData = similarJobs.map(eachSimilarJob => ({
        companyLogoUrl: eachSimilarJob.company_logo_url,
        employmentType: eachSimilarJob.employment_type,
        id: eachSimilarJob.id,
        jobDescription: eachSimilarJob.job_description,
        location: eachSimilarJob.location,
        rating: eachSimilarJob.rating,
        title: eachSimilarJob.title,
      }))
      // console.log(updatedJobDetailsData)
      this.setState({
        jobItemDetails: updatedJobDetailsData,
        skillsList: updatedSkillsList,
        similarJobs: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failed})
    }
  }

  retryJobDetails = () => {
    this.getJobItemDetails()
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.retryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.pending:
        return this.renderLoader()
      case apiStatusConstants.failed:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {jobItemDetails, skillsList, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemDetails

    return (
      <>
        <div className="job-item-detail-container">
          <div className="name-logo-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <p className="job-title">{title}</p>
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
          <div className="desc-and-link">
            <h1 className="desc-heading-single">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="#blank"
              className="website-link"
            >
              <p className="visit-link">Visit</p>
              <BiLinkExternal />
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1 className="skills">Skills</h1>
          <ul className="skills-list">
            {skillsList.map(eachSkill => (
              <li className="each-skill-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-comp-heading">Life at Company</h1>
          <div className="life-at-comp-container">
            <p className="life-at-comp-desc">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
              className="life-at-comp-img"
            />
          </div>
        </div>

        <h1 className="similar-jobs-heading">Similar Jobs</h1>

        <ul className="similar-jobs-list">
          {similarJobs.map(eachSJob => (
            <li className="similar-job-item" key={eachSJob.id}>
              <div className="name-logo-card">
                <img
                  src={eachSJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="job-title">{eachSJob.title}</h1>
                  <div className="rating-card">
                    <AiFillStar className="star" />
                    <p>{eachSJob.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="desc-heading">Description</h1>
              <p>{eachSJob.jobDescription}</p>
              <div className="loc-type-sal-card">
                <div className="loc-type">
                  <div className="loc-card">
                    <MdLocationOn className="location-icon" />
                    <p>{eachSJob.location}</p>
                  </div>
                  <div className="type-card">
                    <GrMail className="type-icon" />
                    <p>{eachSJob.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-container">{this.renderJobItemDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
