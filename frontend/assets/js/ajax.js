class ajax {
  constructor(url, options) {
      this.url = url;
      this.options = options;
  }
  async send(callback) {
      try {
          const response = await fetch(this.url, this.options);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          callback(data);
      } catch (err) {
          console.error('Fetch failed: ', err);
      }
  }
}