import Reveal from '../ui/Reveal'

const field =
  'w-full rounded-full bg-white px-5 py-3.5 text-sm text-forest-950 outline-none placeholder:text-forest-900/40 focus:ring-2 focus:ring-forest-600'

export default function SearchBar() {
  return (
    <Reveal className="relative z-20 mx-auto -mt-12 max-w-5xl px-4">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-3 rounded-[2.5rem] bg-sage-300 p-4 shadow-[0_30px_80px_-20px_rgba(15,36,18,0.45)] md:flex-row md:items-center md:rounded-full md:p-3"
      >
        <input aria-label="Location" className={field} placeholder="Where in the forest?" />
        <select aria-label="Home type" className={field} defaultValue="">
          <option value="">Any home type</option>
          <option>Timber cabin</option>
          <option>Glass house</option>
          <option>Forest retreat</option>
        </select>
        <select aria-label="Budget" className={field} defaultValue="">
          <option value="">Any budget</option>
          <option>Under $700k</option>
          <option>$700k – $1.2M</option>
          <option>$1.2M +</option>
        </select>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-forest-700 px-9 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-forest-900"
        >
          Search homes
        </button>
      </form>
    </Reveal>
  )
}
