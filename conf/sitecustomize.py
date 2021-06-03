# encoding=utf8
import sys

reload(sys)
sys.setdefaultencoding('utf8')

# install the apport exception handler if available
try:
    import apport_python_hook
except ImportError:
    pass
else:
    apport_python_hook.install()
