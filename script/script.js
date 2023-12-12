$(document).ready(function(){ /*스크립트 시작 함수기능*/

    /*슬라이드 애니메이션*/
    $("ul.slide li").eq(0).siblings().hide();/*슬라이드의 이미지 0번째 한테 형제속성주고 숨긴다. */
    var slideIndex=0; /*함수 사용 slideIndex생성해서 0으로 값을 초기화*/
    setInterval(function(){ 
        if(slideIndex<2){ /*만약 slideIndex가 2보다 작다면*/
            slideIndex++; /*증가시켜라*/
        }else{ /*그렇지않다면 */
            slideIndex=0; /*0으로 초기화 시켜라*/
        }
        $("ul.slide li").eq(slideIndex).siblings().fadeOut(100); /*슬라이드 이미지의 slideIndex번째에 자식들을 페이드 효과
        주며 100의 속도로 서서히 사라진다..*/
        $("ul.slide li").eq(slideIndex).fadeIn(100);/*슬라이드 이미지의 slideIndex번째에 자식들을 페이드 효과
        주며 100의 속도로 서서히 나타난다..*/
    },3000); /*3초에 한번씩 반복*/
    

    });
    