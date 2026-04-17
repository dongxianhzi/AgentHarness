-- name: CreatePasswordResetToken :one
INSERT INTO password_reset_token (user_id, token_hash, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: FindValidPasswordResetTokens :many
SELECT * FROM password_reset_token
WHERE used = false AND expires_at > now();

-- name: MarkPasswordResetTokenUsed :exec
UPDATE password_reset_token
SET used = true
WHERE id = $1;

-- name: DeleteExpiredPasswordResetTokens :exec
DELETE FROM password_reset_token
WHERE expires_at < now() OR used = true;