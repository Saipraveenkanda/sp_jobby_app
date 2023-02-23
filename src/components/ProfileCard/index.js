import './index.css'

const ProfileCard = props => {
  const {profileDetails} = props
  const {name, profileImageUrl, shortBio} = profileDetails

  return (
    <div className="profile-bg">
      <img src={profileImageUrl} alt="profile" className="profile-image" />
      <h1 className="profile-name">{name}</h1>
      <p className="profile-desc">{shortBio}</p>
    </div>
  )
}
export default ProfileCard
