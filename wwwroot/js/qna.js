$(document).ready(function () {
    $("#instruction-icon").click(function () {
        $("#instruction-modal").toggleClass("d-none");
        $(this).css("color", function (_, currentColor) {
            return currentColor === "rgb(0, 0, 0)" ? "white" : "black";
        });
        $(this).toggleClass("bg-white");
    });

    $("#instruction-close").click(function () {
        $("#instruction-modal").addClass("d-none");
    });

    $("#askBtn").click(function () {
        $("#askQuestionForm").removeClass("d-none");
        $("#askBtn").addClass("d-none");
    });

    $("#askFormClose").click(function () {
        $("#askQuestionForm").addClass("d-none");
        $("#askBtn").removeClass("d-none");
    });

    // ===== Uploading Files with Popover =====

    const $trigger = $('#popoverTrigger');
    const $filesToBeUploaded = $('#filesToBeUploaded');
    const $textarea = $('textarea[name="question"]');
    const $submitBtn = $('#submitBtn');
    const $viewResources = $('#view-resources');

    let selectedFiles = [];
    let uploadedFiles = [];
    let storedFiles = [];

    // Initialize popover
    const popover = new bootstrap.Popover($trigger[0], {
        trigger: 'manual',
        placement: 'top',
        html: true,
        sanitize: false
    });

    let hideTimeout;
    let popoverInitialized = false;

    // Function to check if submit should be enabled
    function checkSubmitButton() {
        const hasFiles = selectedFiles.length > 0;
        const hasText = $textarea.val().trim().length > 0;
        $submitBtn.prop('disabled', !(hasFiles || hasText));
        $submitBtn.css('opacity', hasFiles || hasText ? '1' : '0.5');
    }

    // Function to adjust textarea rows
    function adjustTextareaRows() {
        if (selectedFiles.length > 0) {
            $textarea.attr('rows', 2);
        } else {
            $textarea.attr('rows', 5);
        }
    }

    // Function to create file preview
    function createFilePreview(file, fileId) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileType = file.type.split('/')[0];

        let thumbnailContent = '';
        let thumbnailClass = '';

        if (fileType === 'image') {
            const imageUrl = URL.createObjectURL(file);
            thumbnailContent = `<img src="${imageUrl}" alt="Preview">`;
        } else if (fileType === 'video') {
            thumbnailClass = 'video-thumbnail';
            thumbnailContent = '<i class="fas fa-video default-icon"></i>';
        } else if (fileType === 'audio') {
            thumbnailClass = 'audio-thumbnail';
            thumbnailContent = '<i class="fas fa-music default-icon"></i>';
        } else if (file.type === 'application/pdf') {
            thumbnailClass = 'pdf-thumbnail';
            thumbnailContent = '<i class="fas fa-file-pdf default-icon"></i>';
        }


        return `
                    <div class="file-preview" data-file-id="${fileId}">
                        <button class="file-remove" onclick="removeFile('${fileId}')">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="file-thumbnail ${thumbnailClass}">
                            ${thumbnailContent}
                        </div>
                        <div class="file-info">
                            <div class="file-name" title="${file.name}">${file.name}</div>
                            <div class="file-size">${fileSize} MB</div>
                        </div>
                        <div class="upload-progress">
                            <div class="upload-progress-bar" data-file-id="${fileId}"></div>
                        </div>
                    </div>
                `;
    }

    function createFileView(file, fileId) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileType = file.type.split('/')[0];

        let thumbnailContent = '';
        let thumbnailClass = '';

        const fileUrl = URL.createObjectURL(file);


        if (fileType === 'image') {
            const imageUrl = URL.createObjectURL(file);
            thumbnailContent = `<img src="${imageUrl}" alt="Preview">`;
        } else if (fileType === 'video') {
            thumbnailClass = 'video-thumbnail';
            thumbnailContent = '<i class="fas fa-video default-icon"></i>';
        } else if (fileType === 'audio') {
            thumbnailClass = 'audio-thumbnail';
            thumbnailContent = '<i class="fas fa-music default-icon"></i>';
        } else if (file.type === 'application/pdf') {
            thumbnailClass = 'pdf-thumbnail';
            thumbnailContent = '<i class="fas fa-file-pdf default-icon"></i>';
        }


        return `
                    <div class="file-preview" style="cursor: pointer" data-file-id="${fileUrl}" data-file-type="${fileType}">
                        <div class="file-thumbnail ${thumbnailClass}">
                            ${thumbnailContent}
                        </div>
                        <div class="file-info">
                            <div class="file-name" title="${file.name}">${file.name}</div>
                        </div>                        
                    </div>
                `;
    }

    // ************************* Modals **************************


    $(document).on("click", ".file-preview", function () {
        var fileUrl = $(this).data("file-id");
        var fileType = $(this).data("file-type");
        console.log(fileUrl, fileType);

        var modalBody = $("#fileModalBody");

        if (fileType === 'image') {
            modalBody.html(`<div class="d-flex justify-content-center"><img src="${fileUrl}" class="img-fluid" style="height: 75vh; width:auto; object-fit: contain;"></div>`);
        } 
        else if (fileType === 'video') {
            modalBody.html(`<video src="${fileUrl}" controls class="w-100" style="max-height: 70vh;"></video>`);
        } 
        else if (fileType === 'audio') {
            modalBody.html(`<audio src="${fileUrl}" controls class="w-100"></audio>`);
        }
        else if (fileType === 'application') {
            modalBody.html(`<iframe src="${fileUrl}" class="w-100" style="height: 70vh;"></iframe>`);
        }
        else {
            modalBody.html(`<p>File type not supported for preview</p>`);
        }

        $('#fileModal').modal('show');

    });

    


    // ************************* Modals **************************

    // Function to simulate upload progress
    function simulateUpload(fileId) {
        const $progressBar = $(`.upload-progress-bar[data-file-id="${fileId}"]`);
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            $progressBar.css('width', progress + '%');
        }, 200);
    }

    // Function to setup popover event listeners
    function setupPopoverEvents() {
        const $popoverEl = $('.popover');

        if ($popoverEl.length && !popoverInitialized) {
            $popoverEl.on('mouseenter', function () {
                clearTimeout(hideTimeout);
            }).on('mouseleave', function () {
                hideTimeout = setTimeout(() => {
                    popover.hide();
                    popoverInitialized = false;
                }, 200);
            });

            $popoverEl.find('[data-upload]').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const uploadType = $(this).data('upload');
                const $input = $(`#${uploadType}Input`);

                popover.hide();
                popoverInitialized = false;
                $input.click();
            });

            popoverInitialized = true;
        }
    }

    // Show popover on hover
    $trigger.on('mouseenter', function () {
        clearTimeout(hideTimeout);
        popover.show();
        setTimeout(setupPopoverEvents, 100);
    });

    // Hide popover when leaving trigger
    $trigger.on('mouseleave', function () {
        hideTimeout = setTimeout(() => {
            if (!$('.popover:hover').length) {
                popover.hide();
                popoverInitialized = false;
            }
        }, 200);
    });

    // Handle file input changes
    $('input[type="file"]').on('change', function () {
        const files = this.files;

        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const fileId = Date.now() + Math.random().toString(36).substr(2, 9);
                const fileData = {
                    id: fileId,
                    file: file,
                    name: file.name,
                    size: file.size,
                    type: file.type
                };

                selectedFiles.push(fileData);

                // Add file preview to the upload area
                $filesToBeUploaded.append(createFilePreview(file, fileId));

                // Start simulated upload
                simulateUpload(fileId);

                // Adjust textarea rows
                adjustTextareaRows();

                // Check submit button
                checkSubmitButton();
            });
        }

        // Reset the input
        this.value = '';
    });

    // Remove file function (global scope)
    window.removeFile = function (fileId) {
        selectedFiles = selectedFiles.filter(f => f.id !== fileId);
        $(`.file-preview[data-file-id="${fileId}"]`).remove();
        adjustTextareaRows();
        checkSubmitButton();
    };

    // Handle textarea input
    $textarea.on('input', function () {
        checkSubmitButton();
    });


    // ********************************
    function renderList() {
        const html = storedFiles.map(fileData => `
                    <div class="bg-white p-4 mt-2 rounded text-end">
                        <p><b>Date:</b> ${fileData?.date}</p>
                        <div class="bg-light p-2 w-75 rounded ms-auto">
                            <p>${fileData?.text ? fileData?.text : ""}</p>
                            <div class="d-flex flex-wrap gap-2">
                                ${fileData?.files ? fileData.files.map(file => createFileView(file.file, file.id)).join("") : ""}
                            </div>
                        </div>
                    </div>
                `).join("");
        $("#qna-list").html(html);
    }
    // *********************************

    // Handle submit
    $submitBtn.on('click', function () {
        const questionText = $textarea.val().trim();

        if (selectedFiles.length > 0 || questionText) {
            // Move files to view-resources section
            const date = new Date();

            const day = date.toLocaleString('en-GB', { day: '2-digit' });
            const month = date.toLocaleString('en-GB', { month: 'short' });
            const year = date.getFullYear();

            const time = date.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const formatted = `${day} ${month}, ${year} ${time}`;

            let objectToBeStored = { date: formatted };

            if (selectedFiles.length > 0) {
                objectToBeStored.files = selectedFiles;

                let resourcesHtml = '<h5 class="mb-3">Uploaded Resources:</h5>';

                selectedFiles.forEach(fileData => {
                    const fileSize = (fileData.size / 1024 / 1024).toFixed(2);
                    const fileType = fileData.type.split('/')[0];
                    let iconClass = 'fas fa-file';
                    let bgColor = '#6c757d';

                    if (fileType === 'image') {
                        iconClass = 'fas fa-image';
                        bgColor = '#0A658D';
                    } else if (fileType === 'video') {
                        iconClass = 'fas fa-video';
                        bgColor = '#E11C1D';
                    } else if (fileType === 'audio') {
                        iconClass = 'fas fa-music';
                        bgColor = '#0C916E';
                    } else if (fileData.type === 'application/pdf') {
                        iconClass = 'fas fa-file-pdf';
                        bgColor = '#FF1C1D';
                    }

                    resourcesHtml += `
                                <div class="uploaded-file">
                                    <div class="uploaded-file-icon" style="background-color: ${bgColor}">
                                        <i class="${iconClass}"></i>
                                    </div>
                                    <div class="uploaded-file-info">
                                        <div class="uploaded-file-name">${fileData.name}</div>
                                        <div class="uploaded-file-details">Size: ${fileSize} MB • Type: ${fileData.type}</div>
                                    </div>
                                </div>
                            `;
                });

                // $viewResources.html(resourcesHtml);
                uploadedFiles = [...selectedFiles];
            }

            if (questionText) {
                objectToBeStored.text = questionText;
            }


            storedFiles.unshift(objectToBeStored);
           
            renderList();

            // Clear the form
            selectedFiles = [];
            $filesToBeUploaded.empty();
            $textarea.val('');
            adjustTextareaRows();
            checkSubmitButton();


        }
    });

    // Hide popover when clicking outside
    $(document).on('click', function (e) {
        if (!$trigger.is(e.target) &&
            !$trigger.has(e.target).length &&
            !$('.popover').is(e.target) &&
            !$('.popover').has(e.target).length) {
            popover.hide();
            popoverInitialized = false;
        }
    });

    // Handle popover events
    $trigger[0].addEventListener('shown.bs.popover', function () {
        setTimeout(setupPopoverEvents, 50);
    });

    $trigger[0].addEventListener('hidden.bs.popover', function () {
        popoverInitialized = false;
        clearTimeout(hideTimeout);
    });

    checkSubmitButton();



});