package db

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestPublicSongDoesNotSerializeUserCredentials(t *testing.T) {
	b, err := json.Marshal(Song{CreatedBy: User{Email: "private@example.invalid", PasswordHash: "private-hash", DisplayName: "Public Name"}})
	if err != nil {
		t.Fatal(err)
	}
	for _, forbidden := range []string{"private@example.invalid", "private-hash", "PasswordHash", "Email"} {
		if strings.Contains(string(b), forbidden) {
			t.Fatalf("private user field serialized: %s", forbidden)
		}
	}
	if !strings.Contains(string(b), "Public Name") {
		t.Fatal("public attribution removed")
	}
}
