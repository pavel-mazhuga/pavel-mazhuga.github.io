<script type="module" src="%js_modern_vendor_path%"></script>
<script type="module" src="%js_modern_app_path%"></script>

<script>
    (function() {
        var d = document;
        var c = d.createElement('script');
        if (!('noModule' in c) && 'onbeforeload' in c) {
            var s = false;
            d.addEventListener('beforeload', function(e) {
                if (e.target === c) {
                    s = true;
                } else if (!e.target.hasAttribute('nomodule') || !s) {
                    return;
                }
                e.preventDefault();
            }, true);
            c.type = 'module';
            c.src = '.';
            d.head.appendChild(c);
            c.remove();
        }
    }());
</script>

<script nomodule src="%js_legacy_vendor_path%"></script>
<script nomodule src="%js_legacy_app_path%"></script>