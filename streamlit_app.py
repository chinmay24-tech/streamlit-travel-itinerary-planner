"""Streamlit Community Cloud entrypoint.

Streamlit Cloud defaults to `streamlit_app.py`, so this file simply executes the
real application in `app.py`. You can also set the main file to `app.py` in the
Cloud dashboard — both work.
"""

import runpy
from pathlib import Path

APP = Path(__file__).with_name("app.py")
runpy.run_path(str(APP), run_name="__main__")
