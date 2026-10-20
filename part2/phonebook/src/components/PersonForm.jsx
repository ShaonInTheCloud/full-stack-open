export default function PersonForm({ name, number, onNameChange, onNumberChange, onSubmit, busy }) {
  return <form onSubmit={onSubmit}>
    <label htmlFor="name">Name</label><input id="name" value={name} onChange={onNameChange} autoComplete="name" required />
    <label htmlFor="number">Phone number</label><input id="number" type="tel" value={number} onChange={onNumberChange} autoComplete="tel" required />
    <button disabled={busy} type="submit">{busy ? 'Saving…' : 'Save contact'}</button>
  </form>
}
