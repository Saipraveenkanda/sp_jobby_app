import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileCard from '../ProfileCard'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}
const profileApiConstants = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    apiStatus: apiStatusConstants.initial,
    profileApiStatus: profileApiConstants.initial,
    jobDetails: [],
    employmentType: '',
    minimumPackage: '',
    searchInput: '',
    activeEmpIds: [],
  }

  // employment_type, minimum_package, and search in state

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }
  // https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search=

  getJobsDetails = async () => {
    const {employmentType, minimumPackage, searchInput} = this.state
    console.log(minimumPackage)
    this.setState({apiStatus: apiStatusConstants.pending})
    const token = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failed})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: profileApiConstants.pending})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updateData,
        profileApiStatus: profileApiConstants.success,
      })
    } else {
      console.log('profile failed')
      this.setState({profileApiStatus: profileApiConstants.failed})
    }
  }

  retryJobDetails = () => {
    this.getJobsDetails()
  }

  retryProfileDetails = () => {
    this.getProfileDetails()
  }

  renderProfileFailure = () => (
    <div className="profile-fail-container">
      <button
        className="prof-fail-btn"
        type="button"
        onClick={this.retryProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoader = () => (
    <div className="loader-profile" data-testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderJobsLoader = () => (
    <div className="loader-jobs" data-testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderProfileCard = () => {
    const {profileApiStatus, profileDetails} = this.state
    switch (profileApiStatus) {
      case profileApiConstants.pending:
        return this.renderProfileLoader()
      case profileApiConstants.success:
        return <ProfileCard profileDetails={profileDetails} />
      case profileApiConstants.failed:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderNoJobsFound = () => (
    <div className="no-jobs-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-desc">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsFailCard = () => (
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

  renderJobs = () => {
    const {apiStatus, jobDetails} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return jobDetails.length > 0 ? (
          <ul className="jobs-list-container">
            {jobDetails.map(eachJobItem => (
              <JobItem jobDetails={eachJobItem} key={eachJobItem.id} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsFound()
        )

      case apiStatusConstants.pending:
        return this.renderJobsLoader()
      case apiStatusConstants.failed:
        return this.renderJobsFailCard()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  submitSearch = () => {
    this.getJobsDetails()
  }

  employmentTypeFilter = event => {
    const {activeEmpIds} = this.state
    const isEmpChecked = event.target.checked
    if (isEmpChecked === true) {
      activeEmpIds.push(event.target.value)
    } else {
      activeEmpIds.pop(event.target.value)
    }
    const employmentTypes = activeEmpIds.join(',')
    this.setState({employmentType: employmentTypes}, this.getJobsDetails)
  }

  renderEmploymentType = () => (
    <ul className="emp-type-lists">
      {employmentTypesList.map(eachType => (
        <li className="type-list-style" key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            id={eachType.employmentTypeId}
            value={eachType.employmentTypeId}
            className="checkbox"
            onChange={this.employmentTypeFilter}
          />
          <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
        </li>
      ))}
    </ul>
  )

  filterSalaryRange = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsDetails)
  }

  renderSalaryRanges = () => (
    <ul className="sal-range-list">
      {salaryRangesList.map(eachSalary => (
        <li className="each-sal-item" key={eachSalary.salaryRangeId}>
          <input
            type="radio"
            id={eachSalary.salaryRangeId}
            value={eachSalary.salaryRangeId}
            className="radio"
            name="salary-range"
            onChange={this.filterSalaryRange}
          />
          <label htmlFor={eachSalary.salaryRangeId}>{eachSalary.label}</label>
        </li>
      ))}
    </ul>
  )

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container-main">
          <div className="profile-filter-container-left">
            <div className="profile-card">{this.renderProfileCard()}</div>
            <hr className="line" />
            <div className="type-filter-card">
              <h1 className="emp-type-heading">Type of Employment</h1>
              {this.renderEmploymentType()}
            </div>
            <hr className="line" />
            <div className="salary-filter-card">
              <h1 className="sal-range-heading">Salary Range</h1>
              {this.renderSalaryRanges()}
            </div>
          </div>

          <div className="jobs-container-right">
            <div className="input-container">
              <input
                type="search"
                className="search-input-style"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
              />
              <button
                className="search-icon-button"
                type="button"
                onClick={this.submitSearch}
                data-testid="searchButton"
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-cards">{this.renderJobs()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
