// api/googleBooks.ts
export async function fetchGoogleBooksInfo(title: string, author: string) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      console.error('Google Books API key is not set');
      return null;
    }
  
    const endpoint = 'https://www.googleapis.com/books/v1/volumes';
    const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    const url = `${endpoint}?q=${query}&key=${apiKey}`;
  
    console.log('Requesting URL:', url); // デバッグ用にURLをログ出力
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      
      console.log('Google Books API response:', JSON.stringify(data, null, 2)); // 完全なレスポンスをログ出力

      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        console.log('First book item:', JSON.stringify(book, null, 2)); // 最初の本の情報をログ出力

        return {
          title: book.title,
          author: book.authors ? book.authors.join(', ') : 'Unknown',
          publisher: book.publisher || 'Unknown',
          description: book.description || 'No description available',
          thumbnail: book.imageLinks ? book.imageLinks.thumbnail : null
        };
      } else {
        console.log('No books found for:', title, author);
        return null;
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      return null;
    }
  }
