package main

import (
	"os"
	"log"
	"net/http"
	"encoding/json"
)

type Status struct {
	Configured	bool	`json:"configured"`
	Image	string	`json:"image"`
	X	int	`json:"x"`
	Y	int	`json:"y"`
}

var status = Status{false, "?", 0, 0}

func ApiStatus(w http.ResponseWriter, r *http.Request) {
	//fmt.Fprintf(w, "> %s", r.URL.Path)//[1:])

	w.Header().Add("Content-Type", "application/json")
	w.Header().Add("Access-Control-Allow-Origin", "*")

	if err := json.NewEncoder(w).Encode(status); err != nil {
		panic(err)
	}
}

func ApiSetStatus(w http.ResponseWriter, r *http.Request) {
	var _status Status

	w.Header().Add("Access-Control-Allow-Origin", "*")

	err := json.NewDecoder(r.Body).Decode(&_status)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	status = _status
}

func main() {
	fs := http.FileServer(http.Dir(os.Args[1]))
	
	http.Handle("/", fs)
	http.HandleFunc("/api/status", ApiStatus)
	http.HandleFunc("/api/setstatus", ApiSetStatus)

	log.Println("Starting placebot-web!")
	log.Println("URL: http://localhost:4000")

	log.Fatal(http.ListenAndServe(":4000", nil))
}