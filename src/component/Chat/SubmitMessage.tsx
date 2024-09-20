

const SubmitMessage = ({handleSubmit, trackKeyRef}: {handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void, trackKeyRef: React.RefObject<HTMLInputElement>}) => {
  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white flex w-full">
              <input
                ref={trackKeyRef}
                type="text"
                className="flex-grow p-2 border rounded-md mr-2"
                placeholder="Type a message"
                id="message"
                name="message"
                required
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                type="submit"
              >
                Send
              </button>
            </form>
  )
}

export default SubmitMessage