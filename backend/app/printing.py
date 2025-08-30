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

    def print_task(self, title: str, description: str = "", category: str = "other"):
        """Clean thermal printer compatible receipt with category indicators."""
        p = Network(self.host, port=self.port, timeout=5)
        
        # Category names (no emojis for thermal printer compatibility)
        category_names = {
            'kitchen': 'KITCHEN',
            'bathroom': 'BATHROOM',
            'bedroom': 'BEDROOM', 
            'living_room': 'LIVING ROOM',
            'office': 'OFFICE',
            'shed': 'SHED/GARAGE',
            'garden': 'GARDEN/YARD',
            'other': 'OTHER'
        }
        
        category_name = category_names.get(category, 'OTHER')
        ts = datetime.now(ZoneInfo(TZ)).strftime("%d-%m-%Y %H:%M")
        
        try:
            # Set smaller text size to save paper
            p.set(align="left", width=2, height=1)  # Slightly smaller but still readable
            
            # Category header (bold and centered)
            p.set(align="center", bold=True, width=2, height=1)
            p.text(f"[ {category_name} ]\n")
            p.set(bold=False, width=2, height=1)
            
            # Separator line
            p.set(align="left", width=2, height=1)
            p.text("=" * 24 + "\n")
            
            # Title (bold and centered) - use better wrapping
            p.set(align="center", bold=True, width=2, height=1)
            title_lines = self._wrap_text_smart(title, 24)  # Match separator width
            for line in title_lines:
                p.text(f"{line}\n")
            p.set(bold=False, width=2, height=1)
            
            # Separator line  
            p.set(align="left", width=2, height=1)
            p.text("=" * 24 + "\n")
            
            # Timestamp
            p.set(align="center", width=2, height=1)
            p.text(f"Time: {ts}\n")
            
            # Description (if provided) - use better wrapping
            if description:
                p.text("\n")
                p.set(align="center", width=2, height=1)
                desc_lines = self._wrap_text_smart(description, 24)  # Match separator width
                for line in desc_lines:
                    p.text(f"{line}\n")
            
            # Final spacing and cut
            p.text("\n")
            p.cut()
        finally:
            try:
                p.close()
            except Exception:
                pass
    
    def _wrap_text(self, text: str, width: int) -> list[str]:
        """Helper function to wrap text to fit within specified width."""
        words = text.split()
        lines = []
        current_line = ""
        
        for word in words:
            if len(current_line + word + " ") <= width:
                current_line += word + " "
            else:
                if current_line:
                    lines.append(current_line.rstrip())
                current_line = word + " "
        
        if current_line:
            lines.append(current_line.rstrip())
        
        return lines if lines else [""]
    
    def _wrap_text_smart(self, text: str, width: int) -> list[str]:
        """Smart text wrapping that avoids breaking words and handles Dutch text better."""
        words = text.split()
        lines = []
        current_line = ""
        
        for word in words:
            # Check if adding this word would exceed the width
            test_line = current_line + word if not current_line else current_line + " " + word
            
            if len(test_line) <= width:
                current_line = test_line
            else:
                # Current line is full, start a new one
                if current_line:
                    lines.append(current_line)
                
                # Handle very long words that don't fit on one line
                if len(word) > width:
                    # Break long words at appropriate points (avoid breaking in middle of common Dutch patterns)
                    while len(word) > width:
                        # Try to find a good break point (after common prefixes/before suffixes)
                        break_point = width
                        
                        # Look for good break points in Dutch words
                        for i in range(min(width, len(word))):
                            char = word[i]
                            # Break after common Dutch prefixes or before suffixes
                            if char in 'aeiou' and i > 2 and i < len(word) - 2:
                                break_point = i + 1
                                break
                        
                        lines.append(word[:break_point])
                        word = word[break_point:]
                    current_line = word
                else:
                    current_line = word
        
        if current_line:
            lines.append(current_line)
        
        return lines if lines else [""]