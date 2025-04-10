package network

type Pagination struct {
	CurrentPage int `json:"currentPage"`
	TotalPage   int `json:"totalPage"`
	TotalData   int `json:"totalData"`
}

type Response struct {
	Status     int         `json:"status"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data,omitempty"`
	Pagination *Pagination `json:"pagination,omitempty"`
}

type BadResponse struct {
	Status  int      `json:"status"`
	Message string   `json:"message"`
	Errors  []string `json:"errors,omitempty"`
}
