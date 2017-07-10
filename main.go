package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
)

var SaveLock sync.Mutex
var DataFile string

func main() {
	var listenAddr string
	var assetDir string

	flag.StringVar(&DataFile, "data", "data.json", "place to store changes")
	flag.StringVar(&listenAddr, "addr", ":8082", "listen address")
	flag.StringVar(&assetDir, "assets", "assets", "web asset directory")

	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(assetDir)))
	http.HandleFunc("/update", HandleUpdate)
	http.HandleFunc("/params", HandleParams)
	http.ListenAndServe(listenAddr, nil)
}

func HandleUpdate(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return
	}
	var ds DataSet
	if err := json.Unmarshal(data, &ds); err != nil {
		w.Write([]byte(`{"error": "bad JSON data"}`))
		return
	}
	ds.Write(DataFile)
	w.Write([]byte(`{"success": true}`))
}

func HandleParams(w http.ResponseWriter, r *http.Request) {
	ds, err := ReadDataSet(DataFile)
	if err != nil {
		log.Println("read data set:", err)
		ds = DefaultDataSet
	}
	data, _ := json.Marshal(ds)
	w.Write(data)
}
