export async function fetchCSVData(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`)
    }

    const text = await response.text()
    return parseCSV(text)
  } catch (error) {
    console.error("Error fetching CSV data:", error)
    return []
  }
}

function parseCSV(csvText: string) {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",")
      const entry: Record<string, string> = {}

      headers.forEach((header, index) => {
        entry[header.trim()] = values[index]?.trim() || ""
      })

      return entry
    })
}
