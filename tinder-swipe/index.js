let isAnimating = false;
let pullDeltaX = 0; // distace of card movement

const DESICION_WINDOW = 100;
function startDrag(event){
    if(isAnimating) return

    // get the first article element
    const actualCard = event.target.closest('article');

    if (!actualCard) return

    const startX = event.pageX ?? event.touches[0].pageX;
    // get initial posistion of mouse or finger
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, {passive: true});
    document.addEventListener('touchend', onEnd, {passive: true});

    function onMove(event){
        // get current position of 
        const currentX = event.pageX ?? event.touches[0].pageX;

        pullDeltaX = currentX - startX;
        if(pullDeltaX === 0) return

        isAnimating = true;

        const deg = pullDeltaX / 15;
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = 'grabbing';

        // change opacity of the choice 
        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;
        const choiceElem = isRight
        ? actualCard.querySelector('.choice.like')
        : actualCard.querySelector('.choice.nope');

        choiceElem.style.opacity = opacity;
    }

    function onEnd(event){
        actualCard.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        const desicionTaken = Math.abs(pullDeltaX) >= DESICION_WINDOW;

        if (desicionTaken){
            const goRight = pullDeltaX >= 0;
            const goLeft = !goRight;

            actualCard.classList.add(goRight ? 'go-right' : 'go-left');
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove();
            }, { once: true });
        } else {
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');
            actualCard.querySelectorAll('.choice').forEach(element => {
                element.style.opacity = 0;
            });
        }
        // reset variables
        actualCard.addEventListener('transitionend', () =>{
            actualCard.removeAttribute('style');
            actualCard.classList.remove('reset');
            pullDeltaX = 0;
            isAnimating = false;
        });
    }
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, {passive: true});