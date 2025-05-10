export const baseUrl: string = "http://localhost:5000/api";

interface ApiResponse<T> {
  data?: T;
  error?: boolean;
  message?: string;
}

export const postRequest = async <T>(url: string, body: string): Promise<ApiResponse<T>> => {
  console.log("body", body);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      let message: string;
      
      if (data?.message) {
        message = data.message;
      } else {
        message = data || "An error occurred";
      }

      return { error: true, message };
    }

    return { data };
  } catch (error) {
    console.error("Post request error:", error);
    return { 
      error: true, 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};

export const getRequest = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      let message = "An error occurred";
      
      if (data?.message) {
        message = data.message;
      }

      return { error: true, message };
    }

    return { data };
  } catch (error) {
    console.error("Get request error:", error);
    return { 
      error: true, 
      message: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};