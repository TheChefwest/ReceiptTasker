import os
from escpos.printer import Network
from datetime import datetime
from zoneinfo import ZoneInfo

PRINTER_IP = os.getenv("PRINTER_IP", "192.168.2.34")
PRINTER_PORT = int(os.getenv("PRINTER_PORT", "9100"))
TZ = os.getenv("TZ", "Europe/Amsterdam")

class ThermalPrinter:
    def __init__(self, host: str = PRINTER_IP, port: int = PRINTER_PORT):
        self.host = host
        self.port = port

    def print_task(self, title: str, description: str = ""):
        """Simple ticket style: bold title, timestamp, description, cut."""
        p = Network(self.host, port=self.port, timeout=5)
        try:
            p.set(align="center", bold=True, double_width=True, double_height=True)
            p.text(f"{title}\n")
            p.set(bold=False, double_width=False, double_height=False)
            p.text("-" * 32 + "\n")
            ts = datetime.now(ZoneInfo(TZ)).strftime("%Y-%m-%d %H:%M")
            p.text(f"When: {ts}\n")
            if description:
                p.text("\n")
                p.text(description + "\n")
            p.text("\n")
            p.text("[TaskPrinter]\n")
            p.cut()
        finally:
            try:
                p.close()
            except Exception:
                pass