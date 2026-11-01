# ---------- Stage 1: build ----------
# A full Go toolchain image (~300MB). We only use it to compile.
FROM golang:1.27-alpine AS build
WORKDIR /src

# Copy only the dependency files first. Docker caches each step (a "layer"),
# so as long as go.mod/go.sum don't change, `go mod download` is skipped on rebuilds.
COPY go.mod go.sum ./
RUN go mod download

# Now copy the source and compile a static binary (CGO off = no C libraries needed at runtime).
COPY . .
RUN CGO_ENABLED=0 go build -o /out/shortly ./processor

# ---------- Stage 2: run ----------
# A tiny image (~10MB) that contains only our binary. The Go toolchain is left behind.
FROM alpine:3.22
RUN adduser -D app
USER app
COPY --from=build /out/shortly /usr/local/bin/shortly

# Documentation only: tells readers the app listens on 8000. Publishing happens in compose.
EXPOSE 8000
CMD ["shortly"]
