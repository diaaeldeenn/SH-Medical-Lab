const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getTests = async (
  page: number,
  limit: number,
  search?: string,
  category?: string,
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  const request = await fetch(`${baseUrl}/test?${params}`, {
    next: { revalidate: 3600 },
  });
  const response = request.json();
  return response;
};
