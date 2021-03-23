(function () {

    var overlay = document.querySelector('.overlay'),
        mOpen = document.querySelectorAll('[data-modal]'),
        mClose = document.querySelectorAll('[data-close]'),
        mStatus = false,
        modal = '',
        typeAnimate = 'fade';
    if (mOpen.length == 0) return;

    [].forEach.call(mOpen, function (el) {
        el.addEventListener('click', function (e) {
            var modalId = el.getAttribute('data-modal');
            modal = document.getElementById(modalId);

            modal.querySelector("[data-id='progress']").value = 0;
            modalShow(modal);
            getProgress(modal);
        });
    });

    document.addEventListener('keydown', modalClose);
    for (let i = 0; i < mClose.length; i++) {
        mClose[i].addEventListener('click', modalClose);
    }

    function modalShow(modal) {
        overlay.classList.remove('fadeOut');
        overlay.classList.add('fadeIn');
        if (typeAnimate === 'fade') {
            modal.classList.remove('fadeOut');
            modal.classList.add('fadeIn');
        } else if (typeAnimate === 'slide') {
            modal.classList.remove('slideOutUp');
            modal.classList.add('slideInDown');
        }
        document.body.style.overflow = 'hidden';
        mStatus = true;
    }

    function modalClose(event) {
        if (mStatus && (!event.keyCode || event.keyCode === 27)) {
            var modals = document.querySelectorAll('.dlg-modal');

            [].forEach.call(modals, function (modal) {
                if (typeAnimate === 'fade') {
                    modal.classList.remove('fadeIn');
                    modal.classList.add('fadeOut');
                } else if (typeAnimate === 'slide') {
                    modal.classList.remove('slideInDown');
                    modal.classList.add('slideOutUp');
                }
            });

            overlay.classList.remove('fadeIn');
            overlay.classList.add('fadeOut');
            mStatus = false;
            document.body.style.overflow = 'auto';
        }
    }

    function getProgress(modal) {
        var progress = modal.querySelector('[data-id="progress"]'),
            contentModal = modal.querySelector('[data-id="content-modal"]'),
            progress_container = modal.querySelector('[data-id="progress-container"]'),
            percent_progress = modal.querySelector('[data-id="percent-progress"]'),
            close_modal = modal.querySelector('[data-id="close-modal"]'),
            progress_div = modal.querySelector('[data-id="progress-div"]');
        if (progress.value >= progress.max) {
            progress_div.style.display = 'none';
            contentModal.style.display = 'block';
            progress_container.style.display = 'block';
            close_modal.style.display = 'block';
            contentModal.style.textAlign = 'left';
            progressBar(modal);
            modal.querySelector('[data-id="content-modal"]')
            contentModal.dispatchEvent(new CustomEvent('scroll'))
            return false;
        }
        progress_container.style.display = 'none';
        close_modal.style.display = 'none';
        progress_div.style.display = 'block';
        contentModal.style.display = 'none';
        progress.value++;
        percent_progress.innerText = progress.value;
        setTimeout(function () {
            getProgress(modal)
        }, 30);
    }

    function progressBar(modal) {
        modal.querySelector('[data-id="content-modal"]').onscroll = function () {
            fillProgressBar(modal)
        };
    }

    function getStyle(el, styleProp) {
        var value, defaultView = (el.ownerDocument || document).defaultView;
        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
            // sanitize property name to css notation
            // (hypen separated words eg. font-Size)
            styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
            return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) { // IE
            // sanitize property name to camelCase
            styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
                return letter.toUpperCase();
            });
            value = el.currentStyle[styleProp];
            // convert other units to pixels on IE
            if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                return (function (value) {
                    var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                    el.runtimeStyle.left = el.currentStyle.left;
                    el.style.left = value || 0;
                    value = el.style.pixelLeft + "px";
                    el.style.left = oldLeft;
                    el.runtimeStyle.left = oldRsLeft;
                    return value;
                })(value);
            }
            return value;
        }
    }

    function fillProgressBar(modal) {
        const contentModal = modal.querySelector('[data-id="content-modal"]');
        var winScroll = contentModal.scrollTop;
        var height = contentModal.scrollHeight - contentModal.offsetHeight;
        var scrolled = (winScroll / height) * 100;
        var maxHeight = parseInt(getStyle(contentModal, 'max-height').match(/\d/g).join(""))
        console.log(maxHeight);
        console.log(typeof maxHeight);
        if (contentModal.offsetHeight < maxHeight) {
            scrolled = 100;
        }
        modal.querySelector('[data-id="myBar"]').style.width = scrolled + "%";
    }

})();