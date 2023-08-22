export class Game {
  constructor() {
    this.images = [
      { src: "images/puzzle-Img.png", title: "SNA" },
      // { src: "images/lotus-temple.jpg", title: "Lotus Temple" },
      // { src: "images/qutub-minar.jpg", title: "Qutub Minar" },
      // { src: "images/statue-of-liberty.jpg", title: "Statue Of Liberty" },
      // { src: "images/taj-mahal.jpg", title: "Taj Mahal" },
    ];
    this.gridSize = 3;
    this.stepCount = 0;
    this.timer = 0;
    this.timerInterval;
    $("#startButton").on("click", () => this.startGame());
    $(".resetButton").on("click", () => this.reset());
  }

  startGame() {
    $("#gameOver").hide();
    $("#actualImageBox").show();
    $(".timeCount").html(this.timer);
    $(".stepCount").html(this.stepCount);
    this.setImage();
    this.enableSwapping("#sortable li");
    this.timerInterval = setInterval(() => this.countUp(), 1000);
    $("#resetButton").eq(0).show();
    $("#startSection").hide();
    $("#gameSection").show();
  }

  countUp() {
    this.timer++;
    $(".timeCount").html(this.timer);
  }

  setImage() {
    let percentage = 100 / (this.gridSize - 1);
    let image = this.images[Math.floor(Math.random() * this.images.length)];
    // $("#imgTitle").html(image.title);
    $("#actualImage").attr("src", image.src);
    $("#sortable").empty();

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      let xpos = percentage * (i % this.gridSize) + "%";
      let ypos = percentage * Math.floor(i / this.gridSize) + "%";
      let li = $('<li class="item" data-value="' + i + '"></li>').css({
        "background-image": "url(" + image.src + ")",
        "background-size": this.gridSize * 100 + "%",
        "background-position": xpos + " " + ypos,
        width: 400 / this.gridSize,
        height: 400 / this.gridSize,
      });
      $("#sortable").append(li);
    }
    $("#sortable").randomize();
  }

  enableSwapping(elem) {
    $(elem).draggable({
      snap: "#droppable",
      snapMode: "outer",
      revert: "invalid",
      helper: "clone",
    });
    $(elem).droppable({
      drop: (event, ui) => {
        this.swapImages(event.target, ui);
        this.stepCount++;
        $(".stepCount").html(this.stepCount);
        if (this.isSolved()) {
          clearInterval(this.timerInterval);
          let score = ((1 / (this.stepCount * this.timer)) * 100000).toFixed(0);
          $(".score").html(score);
          $("#resetButton").eq(0).hide();
          $("#actualImageBox").hide();
          $("#gameOver").show();
        }
      },
    });
  }

  swapImages(droppedElement, uiEventParam) {
    let $dragElem = $(uiEventParam.draggable).clone().replaceAll(droppedElement);
    $(droppedElement).replaceAll(uiEventParam.draggable);
    this.enableSwapping($dragElem);
    this.enableSwapping(droppedElement);
  }

  isSolved() {
    let currentPuzzleOrder = $("#sortable > li").map(function (i, el) {
      return $(el).attr("data-value");
    });
    for (var i = 0; i < currentPuzzleOrder.length - 1; i++) {
      if (currentPuzzleOrder[i] != i) return false;
    }
    return true;
  }

  reset() {
    this.stepCount = 0;
    this.timer = 0;
    clearInterval(this.timerInterval);
    $("#startSection").show();
    $("#gameSection").hide();
  }
}

$.fn.randomize = function (selector) {
  let $elems = selector ? $(this).find(selector) : $(this).children();
  let $parents = $elems.parent();

  $parents.each(function () {
    $(this)
      .children(selector)
      .sort(function () {
        return Math.round(Math.random()) - 0.5;
      })
      .remove()
      .appendTo(this);
  });
  return this;
};
