export default function Filter({ value, onChange }) {
  return <div className="search"><label htmlFor="filter">Find a contact</label><input id="filter" type="search" value={value} onChange={onChange} placeholder="Search by name" /></div>
}
