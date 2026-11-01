package api

import (
	"log"
	"net/http"
)

func StartServer(h *Handler, port string) error {
	server := &http.Server{
		Addr:    ":" + port,
		Handler: h.Routes(),
	}

	log.Println("listening on port", port)
	return server.ListenAndServe()
}
