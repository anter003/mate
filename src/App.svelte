<script>
  import P5 from "p5-svelte";
  import * as s from "./sketch.js"
  import { onMount } from "svelte";
  import { Eq, Term } from "./lib";

  let topbar = document.getElementById("topbar"); 
  let textbox = document.getElementById("textbox"); 
  let eqText = $state("x^4-2x^3-8x^2+5x");

  let eq = $state(new Eq().from_string("x^4-2x^3-12x^2+3x"));
  let eq_diff = $state(new Eq().from_string("4x^3-6x^2-24x+3"));

  let domain = $state(25);
  let zoom = $state(1);
  let bias = $state(0);
  let x_init = $state(0);
  let eta = $state(0.002);
  let ce = $state(100);
  let grad = $state(true);

  const width = window.innerWidth;
  let height = 500;

  function sketch(p)  {
    p.setup = () => {
      s.setup(p, width, height);
    }  

    p.draw = () => {
      s.draw(p, width, height, eq, eq_diff, domain, zoom, bias, x_init, eta, grad, ce);
    }
  }

  function handleKey(event) {
    if (event.key == "Enter") {
      eqText = textbox.value;
    }

    eq = new Eq().from_string(eqText).clean();
    eq_diff = new Eq().from_string(eqText).diff().clean()
  }

  onMount(() => {
    topbar = document.getElementById("topbar");
    textbox = document.getElementById("textbox"); 
    height = window.innerHeight - topbar.offsetHeight;
  })


</script>

<main class="flex flex-col">
  <div class="flex w-full p-4 text-lg text-gray-50 bg-gray-900 shadow-lg justify-between" id="topbar">
    <div class="flex items-center">
      <input type="text" class="mr-2 p-2 border-2 border-gray-400 rounded-md bg-gray-800 hover:bg-slate-700 focus:bg-slate-700" id="textbox" on:keydown={handleKey} placeholder="(계수)x^(차수)꼴로 입력..">
    </div>
    <div class="PT text-3xl flex items-center text-center justify-between">
      <span class="mr-3">y={eq.to_string()}</span>
      <img src="arrow.png" class="mr-3 w-[20%]" alt="arrow">
      <span>y'={eq_diff.to_string()}</span>
    </div>
    <div class="flex flex-col">
      <div class="flex justify-end items-center">
        <span class="mr-1">정의역 : {domain}</span>
        <input type="range" min="10" max="90" bind:value={domain}>
      </div>
      <div class="flex justify-end items-center">
        <span class="mr-1">배수 : x{zoom}</span>
        <input type="range" min="0.2" max="10" step="0.2" bind:value={zoom}>
      </div>
      <div class="flex justify-end items-center">
        <span class="mr-1">이동 : {bias}</span>
        <input type="range" min="-300" max="300" bind:value={bias}>
      </div>
    </div>
  </div>
  
  <P5 {sketch} />
</main>

<div class="fixed flex bottom-0 left-0 p-2.5 rounded-tr-md text-lg text-gray-50 bg-gray-900 shadow-lg justify-between">
  <div class="flex items-center mr-3">
    <span class="mr-1 block w-35">초깃값(x₀) : {x_init}</span>
    <input type="range" min="-30" max="30" step="0.1" bind:value={x_init} class="w-100">
  </div>
  <div class="flex items-center">
    <span class="mr-1 block w-40">학습률(η) : {eta}</span>
    <input type="range" min="0.00001" max="0.01" step="0.00001" bind:value={eta} class="mr-3">
  </div>
  <div class="flex items-center">
    <span class="mr-1 block w-20">색상: {ce}</span>
    <input type="range" min="20" max="400" bind:value={ce}>
  </div>
</div>

<div class="fixed  right-0 top-[50%] p-2.5 rounded-l-md text-center text-lg text-gray-50 bg-gray-900 shadow-lg">
  <fieldset class="flex flex-col">
    <h2 class="text-xl font-semibold">배경</h2>
    <div>
      <span class="mr-2 hover:underline" title="도함수의 함숫값을 배경색으로 설정합니다. 붉은색이 양수, 초록색이 0, 보라색이 음수입니다.">도함수</span>
      <input type="radio" name="grad" value={true} bind:group={grad} class="cursor-pointer">
    </div>
    <div>
      <span class="mr-2 hover:underline" title="x값에 따른 경사하강법의 수렴값을 색으로 배경색색으로 설정합니다. 흰색은 발산하는 구간입니다.">수렴값</span>
      <input type="radio" name="grad" value={false} bind:group={grad} class="cursor-pointer">
    </div>
  </fieldset>
</div>

<div class="hov fixed bottom-0 right-0 p-2.5 rounded-tl-md text-center text-3xl text-gray-50 bg-gray-900 shadow-lg hover:bg-gray-800 cursor-pointer">
  ◎
</div>

<div class="credit flex flex-col fixed bottom-13 right-0 p-3 rounded-md text-gray-50 bg-gray-800">
  <h1 class="text-2xl font-semibold">20704 김성훈</h1>
  <a href="https://github.com/anter003/mate" class="underline">Github Repo</a>
  <img src="good.png" alt="야호" width="100px">
</div>


<style>
  .credit {
    display: none;
  }

  .hov:hover + .credit {
    display: block;
  }

  .credit:hover {
    display: block;
  }
</style>