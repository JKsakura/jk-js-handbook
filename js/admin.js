jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes;
    // Declare Global CKEditor WYSIWYG Fields
    var syntaxEditor = CKEDITOR.replace("form-syntax"),
        descriptionEditor = CKEDITOR.replace("form-description"),
        formEl = $("#note-form"),
        noteList = $("#note-table"),
        categories = [
            {
                slug: 'javascript',
                name: 'JavaScript',
                children: [
                    {
                        slug: 'array',
                        name: 'Array'
                    },
                    {
                        slug: 'booleans',
                        name: 'Booleans'
                    },
                    {
                        slug: 'date',
                        name: 'Date'
                    },
                    {
                        slug: 'error',
                        name: 'Error'
                    },
                    {
                        slug: 'global',
                        name: 'Global'
                    }
                ]
            },
            {
                slug: 'html-dom',
                name: 'HTML DOM',
                children: [
                    {
                        slug: 'attribute',
                        name: 'Attribute'
                    },
                    {
                        slug: 'console',
                        name: 'Console'
                    },
                    {
                        slug: 'document',
                        name: 'Document'
                    },
                    {
                        slug: 'element',
                        name: 'Element'
                    },
                    {
                        slug: 'events',
                        name: 'Events'
                    }
                ]
            },
            {
                slug: 'html-objects',
                name: 'HTML Objects',
                children: [
                    {
                        slug: 'anchor',
                        name: 'Anchor'
                    },
                    {
                        slug: 'abbreviation',
                        name: 'Abbreviation'
                    },
                    {
                        slug: 'address',
                        name: 'Address'
                    },
                    {
                        slug: 'area',
                        name: 'Area'
                    },
                    {
                        slug: 'article',
                        name: 'Article'
                    }
                ]
            },
            {
                slug: 'other-objects',
                name: 'Other Objects',
                children: [
                    {
                        slug: 'css-style-declaration',
                        name: 'CSSStyleDeclaration'
                    },
                    {
                        slug: 'type-conversion',
                        name: 'Type Conversion'
                    },
                    {
                        slug: 'storage',
                        name: 'Storage'
                    }
                ]
            }
        ],
        cache = [];
/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
    var DOMManager = {
        noteHeader: function () {
            headerToggle.menuToggle();
            filterManager.iniCategory();
            $(".notes-header").on("click", function (e) {
                var target = e.target;
                if ($(target).is(".add-btn")) {
                    pageToggle.pageForward(".page1", ".page2");
                    formManager.setForm(e);
                } else if ($(target).hasClass("cancel-btn")) {
                    pageToggle.pageBackward(".page1", ".page2");
                }
            });
        },
        noteBody: function () {
            var selectCategory = $("#form-category"),
                selectSubcategory = $("#form-sub-category"),
                formCategory,
                formSubcategory;
                // console.log(categories);
            categories.forEach(function(category, index){
                // console.log(category);
                formCategory = $("<option></option>").val(index).text(category.name);
                $(selectCategory).append(formCategory);
            });
            $(selectCategory).on('change', function () {
                $(selectSubcategory).empty();
                console.log('works');
                var index = $(this).index();
                var subCategories = categories[index].children;
                subCategories.forEach(function (subcategory, index) {
                    formSubcategory = $("<option></option>").val(index).text(subcategory.name);
                    $(selectSubcategory).append(formSubcategory);
                });
            });
            $(noteList).find("tbody").each(function () {
                noteManager.orderNote(this);
            });
            noteManager.sortNote();
        }
    };
    
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
/* ============================================================== */
// INITIAL NOTE BODY EVENTS
    var filterManager = {
        goSearch: function () {
            $("#filter-search").on("input", function () {
                var search = $(this).val().trim().toUpperCase();
                cache.forEach(function (note) {
                    note.element.hide();
                    if (
                            note.title.trim().toUpperCase().indexOf(search) > -1 || 
                            note.category.trim().toUpperCase().indexOf(search) > -1 || 
                            note.introduction.trim().toUpperCase().indexOf(search) > -1 || 
                            note.syntax.trim().toUpperCase().indexOf(search) > -1 || 
                            note.description.trim().toUpperCase().indexOf(search) > -1
                    ) {
                        $(note.element).show();
                    }
                });
            });
        },
        iniCategory: function () {
            var defaultVal = '<option value="" disabled selected>Category</option>';
            var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
            categories.forEach(function(category){
                var newCategory = $("<option></option>").val(category.slug).text(category.name).appendTo(filterCategory);
            });
        },
        goFilter: function () {
            $("#filter-category").change(function () {
                var filterCategory = $(this).val().trim().toUpperCase();
                cache.forEach(function(note) {
                    note.element.hide();
                    if(note.category.trim().toUpperCase() === filterCategory || filterCategory === "ALL" ) {
                        note.element.show();
                    }
                });
            });
        }
    };

/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = {
        saveNote: function(obj) {
            var noteObj;

            if (obj.id >= 0 && obj.id!== '') {
                var targetID = obj.id,
                    index = notes.map(function (element) { return element.id; }).indexOf(targetID);

                // If the current category or subcategory is updated, then remove the current note from category or subcategory
                //this.removeFromCategory(obj, notes[index], targetID);
                // Push the updated note object into the categories array
                //this.insertToCategory(obj, notes[index], true);

                // Update the current note into the notes array
                notes[index] = obj;
                notes[index].id = targetID;
                notes[index].created = obj.created ? obj.created : new Date();
                noteObj = notes[index];

                // Display the updated current note
                noteManager.displayNote(noteObj, true);
            } else {
                // Create a new note object and push it into notes array
                newNote = obj;
                newNote.id = noteID;
                newNote.created = new Date();
                notes.push(newNote);
                // Update global note ID
                noteID++;
                noteObj = newNote;

                // Push the new note object into the categories array
                //this.insertToCategory(obj, noteObj, false);

                // Display the new note
                noteManager.displayNote(noteObj, false);
            }

            dataManager.saveData(notes);
            // console.log(notes);
            // console.log(categories);
        },
        // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
        displayNote: function(note, update) {
            var row,
                // Format Date into mm/dd/yyyy
                date = new Date(note.created),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear(),
                // Create new note elements into DOM
                id = $("<td></td>").text(note.id),
                title = $("<td></td>").text(note.title),
                created = $("<td></td>").text(month + '/' + day + '/' + year),
                category = $("<td></td>").text(categories[note.category].name),
                subcategory = $("<td></td>").text(categories[note.category].children[note.subcategory].name),
                introduction = $("<td></td>").text(note.introduction),
                temEdit = $("<button></button>").addClass("item-btn edit-btn"),
                itemEditBtn = $("<i></i>").addClass("far fa-edit"),
                itemDelete = $("<button></button>").addClass("item-btn delete-btn"),
                itemDeleteBtn = $("<i></i>").addClass("far fa-trash-alt"),
                editBtn = $("<td></td>").append($(temEdit).append(itemEditBtn)),
                deleteBtn = $("<td></td>").append($(itemDelete).append(itemDeleteBtn));
            // Cache note object
            var obj = {
                id: note.id,
                title: note.title,
                category: note.category,
                subcategory: note.subcategory,
                introduction: note.introduction,
                syntax: note.syntax,
                description: note.description
            };
            if (update === true) {
                // Append all elements into DOM
                row = $("<tr></tr>").append(id, title, created, category, subcategory, introduction, editBtn, deleteBtn);
                var index = notes.map(function(element){ return element.id; }).indexOf(note.id);
                obj.element = row;
                obj.id = note.id;
                cache[index] = obj;
                cache[index].element.replaceWith(row);
            } else {
                row = $("<tr></tr>").append(id, title, created, category, subcategory, introduction, editBtn, deleteBtn).appendTo($(noteList).find('tbody'));
                obj.element = row;
                cache.push(obj);
            }
        },
        // DELETE A NEW NOTE BASED ON THE ID
        deleteNote: function(e) {
            var target = e.target;
            var index = $(target).closest("tr").index();
            var r = confirm("Are You Sure You Want to Delete This Item?");
            if (r === true) {
                // Remove the current note from categories array
                //this.removeFromCategory('', notes[index], notes[index].id);
                // Remove the current note from notes array
                notes.splice(index, 1);
                // Remove the DOM element
                cache[index].element.remove();
                // Remove the current note from cache
                cache.splice(index, 1);
                // Save back the notes array into data
                dataManager.saveData(notes);
            } else {
                // Do nothing if user cancels deleting
                return false;
            }
            // console.log(notes);
            // console.log(categories);
        },
        orderNote: function(e) {
            var oldIndex, newIndex, note;
            $(e).sortable({
                start: function (e, ui) {
                    oldIndex = ui.item.index();
                },
                update: function (e, ui) {
                    newIndex = ui.item.index();
                    note = notes[oldIndex];
                    if( oldIndex < newIndex ) {
                        newIndex += 1;
                    } else {
                        oldIndex += 1;
                    }
                    notes.splice(newIndex, 0, note);
                    notes.splice(oldIndex, 1);
                    cache.splice(newIndex, 0, note);
                    cache.splice(oldIndex, 1);
                    dataManager.saveData(notes);
                }
            });
            $(e).disableSelection();
        },
        sortNote: function () {
            var compare = {
                id: function (a, b) {
                    return a - b;
                },
                title: function (a, b) {
                    if (a < b) {
                        return -1;
                    } else {
                        return a > b ? 1 : 0;
                    }
                },
                date: function (a, b) {
                    a = new Date(a);
                    b = new Date(b);
                    return a - b;
                }
            };

            $(noteList).each(function() {
                var table = this,
                    control = $(table).find("th"),
                    tbody = $(table).find("tbody");
                
                $(control).on("click", function () {
                    var header = this,
                        rows = $(tbody).find("tr").toArray(),
                        order = $(header).data('sort'),
                        column = control.index(this);
                        if (order) {
                            if ($(header).is(".ascending") || $(header).is(".descending")) {
                                $(header).toggleClass('ascending descending');
                                $(tbody).append(rows.reverse());
                            } else {
                                $(control).removeClass("ascending descending");
                                $(header).addClass("ascending");
                                if (compare.hasOwnProperty(order)) {
                                    rows.sort(function (a, b) {
                                        a = $(a).find("td").eq(column).text();
                                        b = $(b).find("td").eq(column).text();
                                        return compare[order](a, b);
                                    });
                                    $(tbody).append(rows);
                                }
                            }
                        }
                });
            });
        },
        // removeFromCategory: function(obj, refObj, id) {
        //     //If the current note's category or subcategory is changed
        //     if (obj === '' || (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory)) {
        //         // Remove it from the category or subcategory
        //         var catNote = categories[refObj.category].children[refObj.subcategory].notes;
        //         var catIndex = catNote.indexOf(id);
        //         catNote.splice(catIndex, 1);
        //     } else {
        //         return;
        //     }
        // },
        // insertToCategory: function (obj, refObj, update) {
        //     if (update === true) {
        //         // If editing note, then check if category or subcategory is changed, if so, push current note into category
        //         if (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory) {
        //             // Push it to the updated category or subcategory
        //             categories[obj.category].children[obj.subcategory].notes.push(refObj.id);
        //             // console.log(categories[obj.category].children[obj.subcategory].notes);
        //         } else {
        //             return;
        //         }
        //     } else {
        //         // If adding new note, then just push new note into category
        //         // Push it to the updated category or subcategory
        //         categories[obj.category].children[obj.subcategory].notes.push(refObj.id);
        //     }
        // }
    };
    
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    var formManager = (function(){
        var formSyntax,
            formDescription,
            formTitle = $("#form-title"),
            formCategory = $("#form-category"),
            formSubCategory = $("#form-sub-category"),
            formIntroduction = $("#form-introduction"),
            formSubmitBtn = $("#form-submit");
        var id, title, category, subcategory, introduction, syntax, description, btnTxt;
        
        return {
            setForm: function(e) {
                var target = e.target,
                    index = $(target).closest("tr").index();

                formSyntax = syntaxEditor.activeFilter.editor;
                formDescription = descriptionEditor.activeFilter.editor;
            
                if( index > -1 ) {
                    var note = notes[index];
                    id = note.id;
                    $(formTitle).val(note.title);
                    $(formCategory).val(note.category);
                    $(formSubCategory).val(note.subcategory);
                    $(formIntroduction).val(note.introduction);
                    formSyntax.setData(note.syntax);
                    formDescription.setData(note.description);
                    btnTxt = "Update Note";
                } else {
                    $(formEl)[0].reset();
                    formSyntax.setData("");
                    formDescription.setData("");
                    btnTxt = "Add Note";
                }

                $(formSubmitBtn).text(btnTxt);
                // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
                pageToggle.pageForward(".page1", ".page2");
            },
            getForm: function() {
                // fetch form data
                title = $(formTitle).val();
                category = $(formCategory).val();
                subcategory = $(formSubCategory).val();
                introduction = $(formIntroduction).val();
                syntax =formSyntax.getData();
                description = formDescription.getData();
                
                // format obj
                var resObj = {
                    id: "",
                    title: title,
                    category: Number(category),
                    subcategory: Number(subcategory),
                    introduction: introduction,
                    syntax: syntax,
                    description: description
                };
                if (id || id>=0) {
                    resObj.id = id;
                }
                return resObj;
            }
        };
    }());
    
/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */   
/* ============================================================== */
    var dataManager = {
        resetData: function() {
            notes = [];
            noteID = 0;
        },
        loadData: function() {
            $.getJSON( "notes.json" )
            .done(function(data) {
                notes = data.notes ? data.notes : [];
                noteID = 0;
                if( notes.length > 0 ) {
                    for(var i=0; i<notes.length; i++) {
                        noteManager.displayNote(notes[i]);
                        if(notes[i].id >= noteID) { noteID = notes[i].id+1; }
                    }
                }
            })
            .fail( function(d, textStatus, error) {
                console.error("getJSON failed, status: " + textStatus + ", error: "+error);
            })
            .always(function() {
                console.log( "complete" );
            });
        },
        saveData: function(notes) {
            var noteData = {"notes": notes};

            $.post("notes.php", {
                json: JSON.stringify(noteData)
            })
            .done(function() {
                console.log( "second success" );
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "finished" );
            });
        }
    };

    // INITIAL NOTE HEADER VISUAL 
    DOMManager.noteHeader();
    DOMManager.noteBody();
    
    // LOAD DATA FROM JSON FILE
    dataManager.loadData();
    dataManager.resetData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    // INITIAL NOTE BODY EVENTS
    $(".page").each(function() {
        var page = this;
        $(page).on("click", function(e) {
            var target = e.target;
            if( $(target).is(".delete-btn") ) {
                noteManager.deleteNote(e);
            } else if( $(target).is(".edit-btn") ) {
                formManager.setForm(e);
            } else if( $(target).is("p.list-group-item") ) {
                $(target).each(function() {
                    $(this).next("ul").stop().slideToggle(300);
                    $(this).stop().toggleClass("closed");
                });
            }
        });
    });
    
    // INITIAL FORM EVENTS
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        noteManager.saveNote(formManager.getForm());
        
        pageToggle.pageBackward(".page1", ".page2");
    });
});