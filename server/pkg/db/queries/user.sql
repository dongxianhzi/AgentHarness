-- name: GetUser :one
SELECT * FROM "user"
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM "user"
WHERE email = $1;

-- name: CreateUser :one
INSERT INTO "user" (name, email, avatar_url)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateUser :one
UPDATE "user" SET
    name = COALESCE($2, name),
    avatar_url = COALESCE($3, avatar_url),
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: CreateUserWithPassword :one
INSERT INTO "user" (name, email, password_hash, password_change_required)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: UpdateUserPassword :exec
UPDATE "user" SET
    password_hash = $2,
    password_change_required = false,
    updated_at = now()
WHERE id = $1;

-- name: SetPasswordChangeRequired :exec
UPDATE "user" SET
    password_change_required = true,
    updated_at = now()
WHERE id = $1;
