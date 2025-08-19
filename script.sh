docker compose exec -T backend python - <<'PY'
import socket
HOST, PORT = "192.168.2.34", 9100
ESC=b"\x1b"
payload = [
    ESC+b"@",               # init
    ESC+b"a\x01", b"*** TaskPrinter TEST ***\n",
    ESC+b"a\x00", b"Hello from Docker backend!\n\n\n",
    b"\x1dV\x00"            # full cut
]
with socket.create_connection((HOST, PORT), timeout=5) as s:
    for part in payload:
        s.sendall(part)
print("✅ Sent raw ESC/POS test")
PY
