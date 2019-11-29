let answerarray = "";
let lastQuestion = "";
let answerSelectLength = -1;
let query = "";

window.addEventListener('DOMContentLoaded', () => {
    const chatBotValue = document.getElementById("JSchatBotValue");
    const chatBotSubmit = document.getElementById("JSchatBotSubmit");

    const chatBotBody = document.getElementById("chatBody");

    // 예상 답변 설정
    const answerSelect = document.getElementsByClassName("JSchatBotAnswerSelect");

    // 블록체인 신청 폼
    const applyForm = document.getElementById('apply');

    // 채팅 입력시 하단으로 강제 스크롤
    const bottomScroll = () => {
        chatBotBody.scrollTo(0, chatBotBody.scrollHeight);
    };

    // 버튼에 자동으로 이벤트 리스너 추가
    const addEvent = () => {

        if (answerSelect.length === answerSelectLength) {
            return false;
        }

        for (let i = 0; i < answerSelect.length; i++) {
            let j = i;
            if (i > answerSelectLength) {
                const t = Number(answerSelect[i].getAttribute("data-idx")) + 1;
                j = t + answerSelectLength;
            }
            const c = answerSelect[i].getAttribute("data-idx");

            const dooooo = () => {
                if (answerSelect[j].innerHTML === lastQuestion) {
                    alert('[선택해서보내기] 똑같은 질의를 여러번 할 수 없습니다!');
                    return false;
                }
                const v =
                    answerSelect[c].getAttribute('data-answer') + `
                    <br>
                    <a href="http://` + answerarray[c].Link + `" target="_blank">자세히보기</a>
                    <br>
                    <button id="JSchatBotRecallForm">
                        리콜 신청하기
                    </button>
                `;

                chatSend(answerSelect[j].innerHTML, false, "query");
                botChat(v);

                const f = document.getElementById('JSchatBotRecallForm');
                f.addEventListener('click', () => {
                    chatSend("신청" + answerSelect[j].innerHTML, false, "apply");
                    apply(answerarray[c].Link_Gubun, answerarray[c].Question);
                });
                f.removeAttribute("id");
            };

            // console.log([j, c]);\
            // console.log(answerSelect[j].getAttribute('eventseted'));
            if (answerSelect[j].getAttribute('eventseted') !== "true") {
                // console.log('이벤트가 감지되지 않음');
                answerSelect[j].addEventListener("click", () => {
                    dooooo();
                    answerSelect[j].setAttribute('eventseted', "true");
                });
            }
        }

        if (answerSelect.length !== 0) {
            answerSelectLength = answerSelect.length - 1;
        }
        // console.log([Number(answerSelectLength + 1), answerSelect.length]);
        // console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
    };

    // 챗봇으로 텍스트를 작성하는 코드
    chatBotValue.addEventListener('keyup', () => {
        if (window.event.keyCode === 13) {
            chatSend(chatBotValue.value, true);
            bottomScroll();
        }
    });

    // 보내기 버튼이 눌렸을때 텍스트를 보내는 코드
    chatBotSubmit.addEventListener('click', () => {
        chatSend(chatBotValue.value, true);
        bottomScroll();
    });

    // 사용자가 메시지를 보내는 기능
    const chatSend = (value, isajax) => {
        // console.log([lastQuestion, value, isajax, Dofunction, lastQuestion === value && Dofunction !== "query"]);
        if (lastQuestion === value) {
            alert('[일반보내기] 똑같은 질의를 여러번 할 수 없습니다!');
            return false;
        } else if (value === "") {
            alert('내용을 입력해주세요!');
            return false;
        }

        const data = `
            <div class="userchat">
                <span class="chat">
                    ` + value + `         
                </span>
            </div>
        `;

        bottomScroll();

        lastQuestion = value;

        if (isajax) {
            AJAX("GET", "localhost:4001/api/user/getData/" + value, null);
        }

        chatBotBody.innerHTML += data;
        chatBotValue.value = "";
    };

    const apply = (link, title) => {
        query = title;
        applyForm.innerHTML = `
        <div class="container">
            <div class="background" id="JSchatBotApplyClose"></div>
            <div class="form">
              <div class="center">
                <h1>리콜 신청</h1>
                <input type="hidden" id="JSchatBotApplyLink" value="` + link + `">
                <input type="text" id="JSchatBotChadae" placeholder="고유번호 입력" value="KMHEM42APXA123456">
                <textarea id="JSchatBotApplyValue" placeholder="리콜 신청 사유 입력"></textarea>
                <button id="JSchatBotApplysSubmit">전송하기</button>
              </div>
            </div>
      </div>
    `;
        applyForm.setAttribute('class', 'show');

        const v = document.getElementById('JSchatBotApplyValue');
        const c = document.getElementById('JSchatBotApplyClose');
        const s = document.getElementById('JSchatBotApplysSubmit');
        const l = document.getElementById('JSchatBotApplyLink');
        const cha = document.getElementById('JSchatBotChadae');

        const close = () => {
            applyForm.removeAttribute('class');
            applyForm.innerHTML = "";
        };

        s.addEventListener('click', () => {
            if (v.value === "") {
                alert("내용을 입력해주세요!");
                return false;
            }

            const data = {
                "user_id": "0xe292c994516c8b35c9743b260ec2086d1a47e14d",
                "user_gubun": encodeURI("소비자"),
                "infoId" : encodeURI(l.value),
                "serialno" : encodeURI(cha.value),
                "request_remarks": encodeURI(v.value),
                "status": "request",
                "score" : 0,
                "score_remarks" : "test"
            };

            // console.log(data);

            AJAX("POST", "localhost:4001/api/user/apply/", data);
            close();
        });

        c.addEventListener('click', () => {
            const check = confirm("정말로 입력을 종료하실건가요?");
            if (check) {
                close();
                close();
            } else {
                return false;
            }
        });
    };

    // 챗봇이 메시지를 보내는 기능
    const botChat = (sendtext) => {
        let chatbottext = "";

        // 웰컴 메세지 출력
        if (sendtext === "welcome") {
            chatbottext = `
                안녕하세요. 리콜봇입니다!
                <br>
                궁금하신 사항이 있으시다면, 무엇이든지 물어보세요!
            `;
        } else if (sendtext === "cantfinddata") {
            chatbottext = `
                질문하신 내용과 유사한 답을 찾지 못했어요.
            `;
        } else if (sendtext === "compelete") {
            chatbottext = query + ` 에 대한 리콜 신청이 완료되었어요!
            `;
        }
        else {
            chatbottext = sendtext;
        }

        const data = `
        <div class="botchat">
        <div class="profile">
          <img src="//placehold.it/50x50">
        </div>

        <div class="chat">
          <span>` + chatbottext + `</span>
        </div>

      </div>
    `;
        chatBotBody.innerHTML += data;
        addEvent();
        bottomScroll();
    };

    // AJAX
    const AJAX = async (method, link, data) => {
        const xhttp = new XMLHttpRequest();

        // console.log([method, link, data]);

        if (method === link || null) {
            error(1);
            return false;
        }

        // 요청 성공시
        xhttp.onreadystatechange = () => {
            console.log(xhttp.readyState);
            if (xhttp.readyState !== XMLHttpRequest.DONE) {
                chatBotValue.setAttribute('disabled', ' disabled');
                chatBotValue.setAttribute('placeholder', '응답을 기다리는 중이에요!');
            } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                chatBotValue.removeAttribute('disabled', ' disabled');
                chatBotValue.setAttribute('placeholder', '궁금하신 내용을 입력해주세요!');
                r = xhttp.responseText;
                if (r === "[\"유사도 0.3 이하 이면 미답변으로 처리합니다.\"]") {
                    botChat('cantfinddata');
                    return false;
                }

                if (r === "[\"complete\"]") {
                    botChat('compelete');
                    return false;
                }

                if (r.indexOf("Gubun") !== -1) {
                    botChat(responseProcess(r));
                    return true;
                }

                botChat(r);
                return true;

            }

            xhttp.addEventListener("error", () => {
                console.error(xhttp.status);
            });
        };
        xhttp.open(method, "http://" + link, true);

        if (data !== null) {
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        await xhttp.send(JSON.stringify(data));

        console.log([method, link, JSON.stringify(data)]);
    };


    // 데이터를 가공하는 함수
    const responseProcess = (d) => {
        // console.log(d);
        answerarray = JSON.parse(JSON.parse(d)[0]);
        let r = "";

        r +=
            answerarray.length +
            `
            개의 결과가 있습니다.
            <br>
            텍스트를 눌러 자세한 내용을 확인해 보세요.
        `;

        for (let i = 0; i < answerarray.length; i++) {
            r += `
                <button class="JSchatBotAnswerSelect" data-answer="` + answerarray[i].Answer + `" data-idx="` + i + `">
                ` +
                answerarray[i].Question;
            +`
                </button>
            `;
        }
        return r;
    };

    // 에러 발생시 오류를 작성하는 코드
    const error = (errorCode) => {
        let query, errorText;

        if (errorCode === 1) {
            query = "[AJAX] 오류가 발생했습니다. 오류코드 001";
            errorText = "[AJAX] 필수 인수가 누락되었습니다.";
        } else {
            query = "알 수 없는 오류가 발생했습니다. 오류코드 000";
            errorText = "[JavaScript] 콘솔의 오류 내용을 확인해주세요."
        }

        botChat(query);
        console.error(errorText);
    };

    botChat("welcome");
});