"use server"

export async function identifyTree(imageUrl) {
  const API_KEY = process.env.PLANTNET_API_KEY;
  const apiUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${API_KEY}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: [imageUrl], organs: ["auto"] })
    });
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        species: data.results[0].species.commonNames[0] || data.results[0].species.scientificName,
        confidence: (data.results[0].score * 100).toFixed(1)
      };
    }
    return null;
  } catch (e) { return null; }
}