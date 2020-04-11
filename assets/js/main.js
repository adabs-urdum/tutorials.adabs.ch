"use strict";

import "babel-polyfill";
import axios from "axios";

Array.prototype.getRandomValue = (inputArray) => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function () {
  class Tutorials {
    constructor(setup) {
      this.tutorialsData = null;
      this.tutorialData = null;
      this.currentTutorial = null;
      this.urlStepId = null;
      this.urlTutorialSlug = null;
      this.filterInputs = [];
      this.tutorials = [];
      this.tutorialButtons = [];
      this.homeButton = document.getElementById("tutorialButton");
      this.homeView = document.getElementById("homeView");
      this.article = document.getElementById("article");
      this.filterContainer = document.getElementById(
        "tutorialsFilterContainer"
      );
      this.tutorialsContainer = document.getElementById("tutorialsContainer");

      this.getTutorialsData();
      this.onUrlChange();
    }

    bindEvents = () => {
      this.filterInputs.forEach((input) => {
        input.addEventListener("change", this.onFilterChange);
      });

      this.tutorialButtons.forEach((button) => {
        button.addEventListener("click", this.onTutorialButtonClick, false);
      });

      this.homeButton.addEventListener("click", this.onHomeButtonClick);

      window.addEventListener("popstate", this.onUrlChange);
    };

    onHomeButtonClick = (e) => {
      e.preventDefault();
      window.history.pushState(
        {
          tutorialId: null,
          slug: null,
          step: null,
        },
        "",
        "/"
      );

      this.onUrlChange();
    };

    onTutorialButtonClick = (e) => {
      window.history.pushState(
        {
          new: true,
        },
        "",
        e.currentTarget.dataset.slug + "?step=0"
      );
      this.onUrlChange();
    };

    onUrlChange = (e) => {
      this.urlTutorialSlug = window.location.href.split("?")[0].split("/")[3];
      this.urlStepId = window.location.search.substr(1).split("=")[1];

      let animationDuration = 200;
      if (!this.article.innerHTML.length) {
        animationDuration = 0;
      }

      if (this.urlTutorialSlug) {
        this.homeView.classList.add("fade");
        window.setTimeout(() => {
          this.homeView.classList.add("hidden");
          this.article.classList.remove("hidden");
        }, animationDuration);

        if (
          !window.history.state ||
          window.history.state.new ||
          !this.article.innerHTML.length
        ) {
          this.article.innerHTML = "";
          this.getTutorialData();
          window.scrollTo(0, 0);
        } else {
          window.setTimeout(() => {
            this.article.classList.remove("fade");
          }, animationDuration * 2);
        }
      } else {
        this.article.classList.add("fade");
        window.setTimeout(() => {
          this.article.classList.add("hidden");
          this.homeView.classList.remove("hidden");
        }, animationDuration);
        window.setTimeout(() => {
          this.homeView.classList.remove("fade");
        }, animationDuration * 2);
      }

      if (e) {
        this.setCurrentStep(this.urlStepId);
      }
    };

    onFilterChange = (e) => {
      let tutorialsFiltered = this.tutorialsData.tutorials;

      if (e.target.value.toLowerCase() !== "all") {
        tutorialsFiltered = tutorialsFiltered.filter((tutorial) =>
          tutorial.tags.includes(e.target.value)
        );
      }
      tutorialsFiltered = tutorialsFiltered.map((tutorial) => tutorial.id);

      this.tutorials.forEach((tutorial) => {
        if (tutorialsFiltered.includes(tutorial.id)) {
          tutorial.el.classList.remove("hidden");
        } else {
          tutorial.el.classList.add("hidden");
        }
      });
    };

    reLoadCodePenScriptSrc = () => {
      let element = document.getElementById("codePenScriptSrc");
      if (element) {
        element.remove();
      }
      element = document.createElement("script");
      element.setAttribute(
        "src",
        "https://static.codepen.io/assets/embed/ei.js"
      );
      element.setAttribute("id", "codePenScriptSrc");
      document.body.appendChild(element);
    };

    getTutorialData = () => {
      axios
        .get("https://myapi.adabs.ch/tutorial/" + this.urlTutorialSlug + "/")
        .then((response) => {
          this.tutorialData = response.data;
          this.setTutorial();
        });
    };

    setTutorial = () => {
      const steps = this.tutorialData.steps;

      const textWrapper = document.createElement("div");
      textWrapper.classList.add("article__textWrapper");
      this.article.appendChild(textWrapper);

      const upper = document.createElement("div");
      upper.classList.add("article__upper");
      textWrapper.appendChild(upper);

      const title = document.createElement("h1");
      title.classList.add("article__title");
      title.innerText = this.tutorialData.title;
      upper.appendChild(title);

      const descriptionWrapper = document.createElement("div");
      descriptionWrapper.classList.add("article__descriptionWrapper");
      upper.appendChild(descriptionWrapper);

      const descriptionTitle = document.createElement("h6");
      descriptionTitle.classList.add("article__descriptionTitle");
      descriptionTitle.innerText = "Intro";
      descriptionWrapper.appendChild(descriptionTitle);

      const description = document.createElement("div");
      description.classList.add("article__description");
      description.innerHTML = this.tutorialData.description;
      descriptionWrapper.appendChild(description);

      const stepAnchors = document.createElement("div");
      stepAnchors.classList.add("article__stepAnchors");
      upper.appendChild(stepAnchors);

      const stepAnchorsTitle = document.createElement("h6");
      stepAnchorsTitle.classList.add("article__stepsTitle");
      stepAnchorsTitle.innerText = "Steps";
      stepAnchors.appendChild(stepAnchorsTitle);

      const stepsList = document.createElement("ul");
      stepsList.classList.add("article__stepsList");
      this.stepsList = stepsList;
      stepAnchors.appendChild(stepsList);

      const stepsContainer = document.createElement("div");
      this.stepsContainer = stepsContainer;
      stepsContainer.classList.add("article__steps");
      textWrapper.appendChild(stepsContainer);

      if (this.tutorialData.steps.length) {
        this.tutorialData.steps.forEach((step, stepKey) => {
          const listElement = document.createElement("li");
          listElement.classList.add("article__stepsListElement");
          const button = document.createElement("button");
          button.dataset.step = stepKey;
          button.addEventListener("click", this.onStepButtonClick);
          button.classList.add("article__stepButton");
          if (this.urlStepId == stepKey) {
            button.classList.add("active");
          }
          button.innerText = step.title;
          listElement.appendChild(button);
          stepsList.appendChild(listElement);

          const stepWrapper = document.createElement("div");
          stepWrapper.classList.add("article__stepWrapper");
          stepWrapper.dataset.step = stepKey;
          stepWrapper.addEventListener("click", this.onStepButtonClick);
          stepsContainer.appendChild(stepWrapper);

          const stepElement = document.createElement("div");
          stepElement.classList.add("article__step");
          stepWrapper.appendChild(stepElement);

          const stepDescription = document.createElement("div");
          stepDescription.classList.add("article__stepDescription");
          stepElement.appendChild(stepDescription);

          const stepTitle = document.createElement("h6");
          stepTitle.innerText = step.title;
          stepTitle.classList.add("article__stepTitle");
          stepDescription.appendChild(stepTitle);

          if (stepKey != 0) {
            const buttonPrevious = document.createElement("button");
            buttonPrevious.classList.add("article__previousStep");
            buttonPrevious.dataset.step = stepKey - 1;
            buttonPrevious.addEventListener("click", this.onStepButtonClick);

            buttonPrevious.innerText =
              "previous: " + this.tutorialData.steps[stepKey - 1].title;
            stepDescription.appendChild(buttonPrevious);
          }

          const stepText = document.createElement("div");
          stepText.innerHTML = step.text;
          stepDescription.appendChild(stepText);

          if (stepKey != this.tutorialData.steps.length - 1) {
            const buttonNext = document.createElement("button");
            buttonNext.classList.add("article__nextStep");
            buttonNext.dataset.step = stepKey + 1;
            buttonNext.addEventListener("click", this.onStepButtonClick);

            buttonNext.innerText =
              "next: " + this.tutorialData.steps[stepKey + 1].title;
            stepDescription.appendChild(buttonNext);
          }

          const codePenWrapper = document.createElement("div");
          codePenWrapper.classList.add("article__codepenWrapper");
          stepElement.appendChild(codePenWrapper);

          const codePenContainer = document.createElement("div");
          codePenContainer.classList.add("article__codepenContainer");
          codePenWrapper.appendChild(codePenContainer);

          if (step.images) {
            step.images.forEach((image, imageKey) => {
              const codePen = document.createElement("div");
              codePen.classList.add("article__codepen");
              codePenContainer.appendChild(codePen);

              const imageElement = document.createElement("img");
              imageElement.src = image.url;
              imageElement.srcset = image.srcset;
              imageElement.sizes = "(max-width: 768px) 72vw, 48vw";
              imageElement.classList.add("article__image");
              codePen.appendChild(imageElement);
            });
          }

          step.codepenTabs.forEach((tab) => {
            const codePen = document.createElement("div");
            codePen.classList.add("article__codepen");
            codePenContainer.appendChild(codePen);

            const codePenParagraph = document.createElement("p");
            codePenParagraph.classList.add(
              "codepen",
              "article__codePenParagraph"
            );

            codePenParagraph.dataset.defaultTab = tab;
            codePenParagraph.dataset.user = "adabs-urdum";
            codePenParagraph.dataset.slugHash = step.codepenId;
            codePen.appendChild(codePenParagraph);

            const canvas = document.createElement("canvas");
            canvas.classList.add("article__canvas");
            canvas.width = 16;
            canvas.height = 9;
            codePen.appendChild(canvas);
          });
        });
      }

      window.setTimeout(() => {
        this.article.classList.remove("fade");
      }, 300);
      this.setCurrentStep(this.urlStepId);
      this.reLoadCodePenScriptSrc();
    };

    onStepButtonClick = (e) => {
      const newStep = e.target.dataset.step;
      if (
        newStep &&
        !e.target.classList.contains("active") &&
        this.urlStepId != newStep
      ) {
        window.history.pushState(
          {
            new: false,
          },
          "",
          this.urlTutorialSlug + "?step=" + newStep
        );
        this.urlStepId = newStep;
        this.onUrlChange();

        this.setCurrentStep(newStep);
      }
    };

    setCurrentStep = (newStep) => {
      [...this.stepsList.children].forEach((step, key) => {
        if (newStep != key) {
          step.children[0].classList.remove("active");
        } else {
          step.children[0].classList.add("active");
        }
      });
      [...this.stepsContainer.children].forEach((step, key) => {
        if (newStep != key) {
          step.classList.remove("active");
          step.setAttribute(
            "style",
            "transform: translateX(" + newStep * -100 + "%) scale(0.88)"
          );
        } else {
          step.classList.add("active");
          step.setAttribute(
            "style",
            "transform: translateX(" + newStep * -100 + "%) scale(1)"
          );
        }
      });
    };

    getTutorialsData = () => {
      axios.get("https://myapi.adabs.ch/tutorials/").then((response) => {
        this.tutorialsData = response.data;
        this.setFilter();
        this.setTutorials();
        this.bindEvents();
      });
    };

    setTutorials = () => {
      const tutorials = this.tutorialsData.tutorials;

      tutorials.forEach((tutorial, key) => {
        const tagList = document.createElement("ul");
        tagList.classList.add("tutorials__tagList");

        const tags = tutorial.tags;
        tags.forEach((tag, key) => {
          const listElement = document.createElement("li");
          listElement.classList.add("tutorials__tagListEntry");
          listElement.innerText = tag;
          tagList.appendChild(listElement);
        });

        const listElement = document.createElement("li");
        listElement.dataset.tags = tags;
        listElement.classList.add("tutorials__tutorial");
        listElement.id = "tutorial" + tutorial.id;

        this.tutorials.push({
          id: tutorial.id,
          el: listElement,
        });

        const codePen = document.createElement("div");
        codePen.classList.add("tutorials__codepen");

        const canvas = document.createElement("canvas");
        canvas.classList.add("tutorials__canvas");
        canvas.width = 4;
        canvas.height = 3;
        codePen.appendChild(canvas);

        if (tutorial.codepenResultId) {
          const codePenParagraph = document.createElement("p");
          codePenParagraph.classList.add("codepen");
          codePenParagraph.dataset.height = "0";
          codePenParagraph.dataset.themeId = "dark";
          codePenParagraph.dataset.defaultTab = "result";
          codePenParagraph.dataset.user = "adabs-urdum";
          codePenParagraph.dataset.slugHash = tutorial.codepenResultId;
          codePenParagraph.dataset.preview = "true";
          codePen.appendChild(codePenParagraph);
        }

        listElement.appendChild(codePen);

        const textContainer = document.createElement("button");
        textContainer.classList.add("tutorials__text", "tutorialButton");
        textContainer.dataset.slug = tutorial.postName;
        textContainer.dataset.url = tutorial.url;
        textContainer.dataset.id = tutorial.id;

        this.tutorialButtons.push(textContainer);

        const date = document.createElement("p");
        date.classList.add("tutorials__date");
        date.innerText = tutorial.date;
        textContainer.appendChild(date);
        textContainer.appendChild(tagList);

        const title = document.createElement("h2");
        title.classList.add("tutorials__title");
        title.innerText = tutorial.title;
        textContainer.appendChild(title);

        const description = document.createElement("p");
        description.innerHTML = tutorial.intro;
        textContainer.appendChild(description);

        listElement.appendChild(textContainer);

        this.tutorialsContainer.appendChild(listElement);
        this.reLoadCodePenScriptSrc();
      });
    };

    setFilter = () => {
      const tags = ["All"].concat(this.tutorialsData.tags);

      tags.forEach((tag, key) => {
        const input = document.createElement("input");
        input.classList.add("tutorials__radio");
        input.id = "tag" + tag;
        input.type = "radio";
        input.value = tag;
        input.name = "tag";
        input.checked = key === 0 ? true : false;
        this.filterInputs.push(input);

        const span = document.createElement("span");
        span.innerText = tag;

        const label = document.createElement("label");
        label.classList.add("tutorials__tagLabel");
        label.setAttribute("for", "tag" + tag);
        label.appendChild(input);
        label.appendChild(span);

        const listElement = document.createElement("li");
        listElement.classList.add("tutorials__tag");
        listElement.appendChild(label);

        this.filterContainer.appendChild(listElement);
      });
    };
  }

  const tutorials = new Tutorials({});
});
