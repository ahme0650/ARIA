import { useEffect, useState } from "react"

export default function useIsMobile(query = "(max-width: 760px)") {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const updateMatches = () => setMatches(media.matches)

    updateMatches()
    media.addEventListener("change", updateMatches)
    return () => media.removeEventListener("change", updateMatches)
  }, [query])

  return matches
}
